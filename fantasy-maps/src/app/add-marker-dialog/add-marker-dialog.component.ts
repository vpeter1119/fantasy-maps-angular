import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MapService } from 'app/map/map.service';
import { environment } from 'environments/environment';

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
    var mapId = this.mapService.getCurrentMapId();
    if (environment.debug) console.log('#addMarkerComponent -> onSubmit() -> formData.value: ', formData.value);
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
        desc: formData.value.desc,
        url: formData.value.url,
        map: mapId,
        category: formData.value.category
      }
    }
    this.mapService.postGeoJson(newMarkerData);
    this.dialogRef.close();
    this.mapService.fetchGeoJson(mapId);
  }

}
