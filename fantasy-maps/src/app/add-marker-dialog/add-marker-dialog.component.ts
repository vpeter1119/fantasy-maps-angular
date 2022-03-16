import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MapService } from 'app/map/map.service';

@Component({
  selector: 'app-add-marker-dialog',
  templateUrl: './add-marker-dialog.component.html',
  styleUrls: ['./add-marker-dialog.component.css']
})
export class AddMarkerDialogComponent implements OnInit {

  isLoading = true;

  constructor(
    private mapService: MapService,
    public dialogRef: MatDialogRef<AddMarkerDialogComponent>
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
  }

  onSubmit(formData) {
    this.isLoading = true;
    var newMarkerData = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.mapService.LatLngToCoordinates(this.mapService.getContextPosition())
      },
      properties: {
        name: formData.value.title,
        icon: formData.value.icon,
        url: formData.value.url,
        map: "forgotten-realms",
        category: formData.value.category
      }
    }
    this.mapService.postGeoJson(newMarkerData);
    this.dialogRef.close();
    this.mapService.fetchGeoJson('forgotten-realms');
  }

}
