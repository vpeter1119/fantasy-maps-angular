import { Component, Input, OnInit } from '@angular/core';
import { IconsService } from 'app/common/icons.service';
import { MapService } from 'app/map/map.service';
import { GeoJSONOptions, LatLng } from 'leaflet';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  position: LatLng;
  icons;

  constructor(
    private iconsService: IconsService,
    private mapService: MapService
  ) {
    this.icons = this.iconsService.getIcons();
  }

  ngOnInit(): void {
  }

  onAddMarker(): void {
    this.position = this.mapService.getContextPosition();
    console.log('#contextMenuComponent -> onAddMarker() called ', this.position);
    var newMarkerData = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.mapService.LatLngToCoordinates(this.position)
      },
      properties: {
        name: "New Marker",
        map: "forgotten-realms",
        category: "other"
      }
    }
    this.mapService.postGeoJson(newMarkerData);
  }

}
