import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  /* General Config Vars */

  isLoading: boolean;
  factorx = 0.0625;
  factory = 0.0625;
  mapheight = 4096;
  mapwidth = 4096;
  mapMinZoom = 1;
  mapMaxZoom = 4;
  initZoom = 3;
  initCenter = L.latLng(-1942, 1294, 3);
  mapName = this.route.snapshot.paramMap.get('index');
  customCRS: any;
  map: any;
  layerbounds: L.LatLngBounds;
  tileLayerString = `assets/${this.mapName}/tiles/{z}-{x}-{y}.jpg`;
  mapOptions = {
    crs: '',
    layers: [],
    zoom: this.initZoom,
    center: this.initCenter
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.ConfigureCRS();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.SetMapBounds(map);
    this.AddTileLayer(map);
    this.isLoading = false;
  }

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

  AddTileLayer(map) {
  /* Set up Tile Layer */
    console.warn('Adding tile layer.');
    var tileLayerOptions = {
      bounds: this.layerbounds,
      tileSize: L.point(256, 256),
      tolerance: 0.8,
      noWrap: true,
      minZoom: this.mapMinZoom,
      maxZoom: this.mapMaxZoom,
      tms: true,
      attribution: '&copy; Peter Vertesi, 2020'
    };
    L.tileLayer(this.tileLayerString, tileLayerOptions).addTo(map);
  }

  Test(event) {
    //console.warn(this.LatLngToCoordinates(event.latlng));
    console.warn(event);
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

}
