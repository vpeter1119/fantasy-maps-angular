import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMarkerDialogComponent } from 'app/add-marker-dialog/add-marker-dialog.component';
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
    private mapService: MapService,
    public dialog: MatDialog
  ) {
    this.icons = this.iconsService.getIcons();
  }

  ngOnInit(): void {
  }

  onAddMarker(): void {
    const dialogRef = this.dialog.open(AddMarkerDialogComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.isAuth = this.authService.getIsAuth();
      //this.currentUser = this.authService.getCurrentUserRaw();
      //console.log('#navbarComponent -> onOpenLogin() -> currentUser: ', this.currentUser);
    });
  }

}
