import { Component, OnInit } from '@angular/core';
import { MapService } from 'app/map/map.service';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map-new',
  templateUrl: './map-new.component.html',
  styleUrls: ['./map-new.component.css']
})
export class MapNewComponent implements OnInit {

  // Map setup
  mapId = 'eriador';
  mapOptions = {};
  mapData;

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.mapData = this.mapService.getMap(this.mapId);
    this.mapOptions = {
      layers: [
        tileLayer(`assets/${this.mapId}/tiles/{z}-{x}-{y}.jpg`, { maxZoom: 18, attribution: '...' })
      ],
      zoom: this.mapData.initZoom,
      minZoom: this.mapData.minZoom,
      maxZoom: this.mapData.maxZoom,
      center: latLng(this.mapData.initCenter[0], this.mapData.initCenter[1])
    }
  }

}
