import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import { MapService } from './map.service';
//import { GeoJSON } from './geojson.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input('mapId') mapId: string;

  data: GeoJSON.FeatureCollection;
  geoJsonSub: Subscription;

  /* General Config Vars */

  debug = !environment.production;
  param;
  isLoading: boolean;
  factorx = 0.0625;
  factory = 0.0625;
  mapheight = 4096;
  mapwidth = 4096;
  mapMinZoom = 1;
  mapMaxZoom = 4;
  initZoom = 3;
  initCenter = L.latLng(-1942, 1294, 3);
  mapName = '';
  customCRS: any;
  map: any;
  layerbounds: L.LatLngBounds;
  tileLayerString = '';
  geoJsonLayerGroup: L.LayerGroup = new L.LayerGroup();
  geoJsonLayer: L.GeoJSON;
  defaultMarkerIcon: L.Icon;
  mapOptions = {
    crs: '',
    layers: [],
    zoom: this.initZoom,
    center: this.initCenter,
  };
  mapLayersControl = {
    baseLayers: {},
    overlays: {}
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    public mapService: MapService,
  ) {
    // Router config
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // Get map name
    this.mapName = this.route.snapshot.paramMap.get('index');
    // Set tile layer string
    this.tileLayerString = `assets/${this.mapName}/tiles/{z}-{x}-{y}.jpg`;
    // Add custom CRS
    this.ConfigureCRS();
    const iconUrl = encodeURI(`data:image/svg+xml,${btoa('assets/icons/custommarker.svg')}`);
    this.defaultMarkerIcon = new L.Icon({
      iconUrl: 'assets/icons/position-marker.png',
      //iconUrl: iconUrl,
      iconSize: [58, 58],
      iconAnchor: [29, 58],
      popupAnchor: [0, -43],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0,0]
    });
  }

  ngOnInit(): void {
  }

  onMapReady(map: L.Map) {
    //if (this.debug) console.warn('onMapReady called');
    this.map = map;
    this.SetMapBounds(map);
    this.geoJsonLayerGroup.addTo(this.map);
    this.LoadMapContent(this.mapId);
    this.isLoading = false;
  }

  ngOnChanges(changes) { 
    if (!changes.mapId.firstChange) {
      if (this.debug) console.warn(this.map);
      this.geoJsonLayerGroup.clearLayers();
      this.LoadMapContent(changes.mapId.currentValue);
    }
  }

  LoadMapContent(mapToLoad: string) {
    //if (this.debug) console.warn('LoadMapContent called');
    if (this.map != null) {
      if (this.debug) console.warn('layers cleared');
      this.map._layers = {};
      if (this.debug) console.warn(this.map._layers);
    }
    
    this.titleService.setTitle(`${mapToLoad} | Fantasy Maps by Peter Vertesi`);
    var newTileLayerString = `assets/${mapToLoad}/tiles/{z}-{x}-{y}.jpg`;
    var tileLayerOptions = {
      bounds: this.layerbounds,
      tileSize: L.point(256, 256),
      tolerance: 0.8,
      noWrap: true,
      minZoom: (mapToLoad == 'faerun') ? 2 : this.mapMinZoom,
      maxZoom: (mapToLoad == 'faerun') ? 5 : this.mapMaxZoom,
      tms: true,
      attribution: '&copy; Peter Vertesi, 2020'
    };
    let newTileLayer = L.tileLayer(newTileLayerString, tileLayerOptions);
    //this.map.addLayer(newTileLayer);
    this.mapLayersControl.baseLayers = { base: newTileLayer };
    //newTileLayer.addTo(this.map);
    this.geoJsonSub = this.mapService.getGeoJson(mapToLoad).subscribe((data: GeoJSON.FeatureCollection) => {
      this.LoadGeoJsonData(data);
    });
  };

  ConfigureCRS() {
    /* Configure custom CRS */

    this.customCRS = L.Util.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      transformation: new L.Transformation(this.factorx, 0, -this.factory, 0),

      scale: function (zoom) {
        return Math.pow(2, zoom);
      },

      zoom: function (scale) {
        return Math.log(scale) / Math.LN2;
      },

      distance: function (latlng1, latlng2) {
        var dx = latlng2.lng - latlng1.lng,
          dy = latlng2.lat - latlng1.lat;

        return Math.sqrt(dx * dx + dy * dy);
      },
      infinite: true
    });

    this.mapOptions.crs = this.customCRS;
  }

  SetMapBounds(map) {
    /* Set boundaries */
    var sw = map.unproject([0, this.mapheight], 4);
    var ne = map.unproject([this.mapwidth, 0], 4);
    this.layerbounds = new L.LatLngBounds(sw, ne);
    map.setMaxBounds(this.layerbounds);
  }

  LoadGeoJsonData(data: GeoJSON.FeatureCollection) {
    this.geoJsonLayer = new L.GeoJSON(data, {
      pointToLayer: this.CreateCustomMarker.bind(this),
      onEachFeature: this.CreateGeoJsonPopup,
      coordsToLatLng: this.CoordinatesToLatLng
    });
    this.geoJsonLayerGroup.addLayer(this.geoJsonLayer);
    //this.geoJsonLayer.addTo(this.map);
    //this.geoJsonLayer.addData(data);
  }

  CreateCustomMarker(feature: GeoJSON.Feature, latlng: L.LatLng) {
    var icon = this.defaultMarkerIcon;
    let marker = new L.Marker(latlng, {
      icon: icon
    });
    return marker;
  }

  CreateGeoJsonPopup(feature: GeoJSON.Feature, layer: L.GeoJSON) {
    var popupContent = `<h3><a href="${feature.properties.url}" target="_blank" rel="noopener noreferrer">${feature.properties.name}</a></h3>${feature.properties.desc}`;
    layer.bindPopup(popupContent);
  }

  LatLngToCoordinates(original: L.LatLng) {
    //Convert latLng to map-specific coordinates
    let coordinates = [original.lng, -original.lat];
    return coordinates;
  }

  CoordinatesToLatLng(original: number[]) {
    //Convert map-specific coordinates to standard Leaflet LatLng
    let latlng = new L.LatLng(-original[1], original[0]);
    return latlng;
  }

  ngOnDestroy(): void {
    this.geoJsonSub.unsubscribe();
  }

}
