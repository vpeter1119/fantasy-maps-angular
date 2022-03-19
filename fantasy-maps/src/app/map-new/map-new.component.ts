import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'app/auth/auth.service';
import { IconsService } from 'app/common/icons.service';
import { ContextMenuComponent } from 'app/context-menu/context-menu.component';
import { MapService } from 'app/map/map.service';
import { environment } from 'environments/environment';
import * as L from 'leaflet';
import { latLng, latLngBounds, LeafletEvent, LeafletMouseEvent, marker, polygon, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-new',
  templateUrl: './map-new.component.html',
  styleUrls: ['./map-new.component.css']
})
export class MapNewComponent implements OnInit {

  @Input() mapId: string;
  @Output() markerClicked = new EventEmitter<object>();

  // Map setup
  mapObject;
  //mapId = 'eriador';
  mapOptions = {};
  layersControl = {};
  defaultLayers = [];
  geoJsonLayer = [];
  baseLayer = [];
  markers;
  areas;
  mapData;
  currentZoom;
  currentCenter;

  // Markers
  defaultIcon: L.DivIcon = L.divIcon({
    html: `<div class="custom-map-marker"><i class="ra ra-scroll-unfurled ra-3x"></i></div>`,
    className: 'custom-map-marker-container',
    iconSize: [40, 40],
    iconAnchor: [25,65]
  })

  // Context menu
  contextMenuComponent: ComponentRef<ContextMenuComponent>;
  contextPopup: L.Popup;

  // API
  geoJsonSub: Subscription;
  //geoJsonLayer: geojson

  constructor(
    private mapService: MapService,
    private titleService: Title,
    private authService: AuthService,
    private iconsService: IconsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  ngOnInit(): void {
    // Set up default map options
    this.mapData = this.mapService.getMap(this.mapId);
    this.titleService.setTitle(`${this.mapData.title} | Fantasy Maps by Peter Vertesi`);
    this.mapOptions = {
      /* layers: [
        tileLayer(`assets/${this.mapData.folderName}/tiles/{z}-{x}-{y}.jpg`, { maxZoom: 18, attribution: '...' })
      ], */
      crs: this.ConfigureCRS(),
      zoom: this.mapData.initZoom,
      minZoom: this.mapData.minZoom,
      maxZoom: this.mapData.maxZoom,
      center: latLng(this.mapData.initCenter[0], this.mapData.initCenter[1]),
      maxBounds: latLngBounds( latLng(this.mapData.bounds[0][0],this.mapData.bounds[0][1]), latLng(this.mapData.bounds[1][0],this.mapData.bounds[1][1])),
      fitBounds: latLngBounds( latLng(this.mapData.bounds[0][0],this.mapData.bounds[0][1]), latLng(this.mapData.bounds[1][0],this.mapData.bounds[1][1]))
    }
    this.currentZoom = this.mapData.initZoom;
    // Add tileLayer
    this.baseLayer = [ tileLayer(`assets/${this.mapData.folderName}/tiles/{z}-{x}-{y}.jpg`, { 
      maxZoom: 18, 
      attribution: '...',
      bounds: latLngBounds( latLng(this.mapData.bounds[0][0],this.mapData.bounds[0][1]), latLng(this.mapData.bounds[1][0],this.mapData.bounds[1][1])),
    }) ];
    // Set up layers
    // Add GeoJSON data
    this.geoJsonSub = this.mapService.getGeoJson(this.mapId).subscribe((data: GeoJSON.FeatureCollection) => {
      if (environment.debug) console.log('#mapComponent -> LoadMapContent() -> data: ', data);
      var gJLayer = L.geoJSON(data, {
        pointToLayer: this.CreateCustomMarker.bind(this),
        onEachFeature: this.BindDetailsEvent.bind(this),
        coordsToLatLng: this.mapService.CoordinatesToLatLng
      });
      this.geoJsonLayer.push(gJLayer);
    });
  }

  onClick(e: LeafletMouseEvent) {
    var coordinates = this.mapService.LatLngToCoordinates(e.latlng);
    if (environment.debug) console.log('coordinates: ', coordinates);
  }

  onZoom(e: LeafletEvent) {
    console.log(e);
  }

  onMapReady(map: L.Map) {
    this.mapObject = map;
    this.mapObject.on('contextmenu', <LeafletMouseEvent>(e) => {
      this.openContextPopup(e);
    });
    //this.mapObject.setMaxBounds(this.SetMapBounds(this.mapObject));
  }

  openContextPopup(e) {
    if (this.contextPopup) this.contextPopup.closePopup();
    e.originalEvent.preventDefault();
    this.contextMenuComponent = this.resolver.resolveComponentFactory(ContextMenuComponent).create(this.injector);
    this.contextMenuComponent.changeDetectorRef.detectChanges();
    this.contextPopup = L.popup();
    this.contextPopup.setLatLng(e.latlng);
    this.mapService.setContextPosition(e.latlng);
    if (environment.debug) console.log('#mapComponent -> e.latlng: ', e.latlng);
    if (this.authService.getIsAuth()) {
      //this.contextPopup.setContent(`<p><button mat-button (click)="onAddMarker()">[+] Add Marker</button><p><p><button mat-button>[+] Begin Line</button></p><p><button mat-button>[X] Close</button></p>`);
      this.contextPopup.setContent(this.contextMenuComponent.location.nativeElement);
    } else {
      this.contextPopup.setContent(`<p>You are not allowed to use this feature! Please log in first.</p>`);
    }
    this.contextPopup.openOn(this.mapObject);
  }

  CreateCustomMarker(feature: GeoJSON.Feature, latlng: L.LatLng) {
    let iconName = '';
    if (feature.properties.icon) {
      iconName = feature.properties.icon;
    } else if (feature.properties.category) {
      //iconName = this.categoryIcons[feature.properties.category];
      iconName = 'ra ra-scroll-unfurled';
    } else {
      iconName = 'ra ra-scroll-unfurled';
    }
    let icon = L.divIcon({
      html: `<div class="custom-map-marker" id="${feature.id}"><i class="${iconName} ra-3x"></i></div>`,
      className: 'custom-map-marker-container',
      iconSize: [40, 40],
      iconAnchor: [25,65]
    });
    let marker = new L.Marker(latlng, {
      icon: icon
    });
    return marker;
  }

  BindDetailsEvent(feature: GeoJSON.Feature, layer: L.GeoJSON) {
    layer.on('click', (e) => {
      var data = e.target.feature.properties;
      data.id = feature.id;
      if (environment.debug) console.log('#mapComponent -> click event -> data: ', data);
      this.markerClicked.emit(data);
      //this.mapService.setSelectedData(data);
    }); 
  }

  ConfigureCRS() {
    // Configure custom CRS

    return L.Util.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      transformation: new L.Transformation(this.mapData.factorx, 0, -this.mapData.factory, 0),

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
    var sw = map.unproject([0, this.mapData.height], 4);
    var ne = map.unproject([this.mapData.width, 0], 4);
    return new L.LatLngBounds(sw, ne);
  }

}
