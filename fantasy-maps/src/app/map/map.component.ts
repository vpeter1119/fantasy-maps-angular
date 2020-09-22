import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import { MapService } from './map.service';

export interface MapData {
  id: string,
  name: string,
  height: number,
  width: number,
  factorx: number,
  factory: number,
  minZoom: number,
  maxZoom: number,
  initZoom: number,
  initCenter: number[]
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input('mapId') mapId: string;

  data: GeoJSON.FeatureCollection;
  geoJsonSub: Subscription;

  /* Placeholder Map Data */

  maps = {
    highrock: {
      id: 'highrock',
      name: 'High Rock',
      height: 4096,
      width: 4096,
      factorx: 0.0625,
      factory: 0.0625,
      minZoom: 1,
      maxZoom: 4,
      initZoom: 3,
      initCenter: [-1942, 1294, 3]
    },
    faerun: {
      id: 'faerun',
      name: 'Forgotten Realms',
      height: 8192,
      width: 8192,
      factorx: 0.03125,
      factory: 0.03125,
      minZoom: 2,
      maxZoom: 5,
      initZoom: 3,
      initCenter: [-1942, 1294, 3]
    }
  };

  /* General Config Vars */

  debug = !environment.production;
  param;
  isLoading: boolean;
  chosenMap: MapData;
  factorx: number;
  factory: number;
  mapheight: number;
  mapwidth: number;
  mapMinZoom: number;
  mapMaxZoom: number;
  initZoom: number;
  initCenter: L.LatLng;
  customCRS: any;
  map: L.Map;
  mapObject: L.Map;
  layerbounds: L.LatLngBounds;
  tileLayerGroup: L.LayerGroup = new L.LayerGroup();
  tileLayer: L.TileLayer;
  tileLayerString = '';
  geoJsonLayerGroup: L.LayerGroup = new L.LayerGroup();
  geoJsonLayer: L.GeoJSON;
  defaultMarkerIcon: L.Icon;
  mapOptions = {
    crs: '',
    layers: [],
    zoom: 2,
    center: L.latLng(0,0,2),
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    public mapService: MapService,
  ) {
    // Router config
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.defaultMarkerIcon = new L.Icon({
      iconUrl: 'assets/icons/position-marker.png',
      iconSize: [58, 58],
      iconAnchor: [29, 58],
      popupAnchor: [0, -43],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0,0]
    });
  }

  ngOnInit(): void {
    // Configure initial map data
    this.chosenMap = this.maps[this.mapId];
    this.ApplyMapConfig(this.chosenMap);
    // Initialize map
    this.mapObject = L.map('map', {
      crs: this.ConfigureCRS(),
      center: this.initCenter,
      zoom: this.initZoom
    });
    //this.map = this.mapObject;
    this.mapObject.setMaxBounds(this.SetMapBounds(this.mapObject));
    this.tileLayerGroup.addTo(this.mapObject);
    this.geoJsonLayerGroup.addTo(this.mapObject);
    this.LoadMapContent(this.mapId);
    this.isLoading = false;
  }

  ngOnChanges(changes) { 
    if (!changes.mapId.firstChange) {
      this.geoJsonLayerGroup.clearLayers();
      this.LoadMapContent(changes.mapId.currentValue);
    }
  }

  ApplyMapConfig(mapData: MapData) {
    this.chosenMap = mapData;
    this.factorx = this.chosenMap.factorx;
    this.factory = this.chosenMap.factory;
    this.mapheight = this.chosenMap.height;
    this.mapwidth = this.chosenMap.width;
    this.mapMinZoom = this.chosenMap.minZoom;
    this.mapMaxZoom = this.chosenMap.maxZoom;
    this.initZoom = this.chosenMap.initZoom;
    this.initCenter = L.latLng(this.chosenMap.initCenter[0], this.chosenMap.initCenter[1], this.chosenMap.initCenter[2]);
    // Adjust zoom and center
    //this.map.panTo(this.initCenter);
  }

  LoadMapContent(mapToLoad: string) {
    this.ApplyMapConfig(this.maps[mapToLoad]);
    if (this.map != null) {
      //this.map._layers = {};
    }
    
    this.titleService.setTitle(`${this.chosenMap.name} | Fantasy Maps by Peter Vertesi`);
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
    this.tileLayer = newTileLayer;
    this.tileLayerGroup.addLayer(this.tileLayer);
    this.geoJsonSub = this.mapService.getGeoJson(mapToLoad).subscribe((data: GeoJSON.FeatureCollection) => {
      this.LoadGeoJsonData(data);
    });
  };

  ConfigureCRS() {
    // Configure custom CRS

    return L.Util.extend({}, L.CRS.Simple, {
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
  }

  SetMapBounds(map) {
    // Set boundaries
    var sw = map.unproject([0, this.mapheight], 4);
    var ne = map.unproject([this.mapwidth, 0], 4);
    return new L.LatLngBounds(sw, ne);
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
