import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';
import { IconsService } from 'app/common/icons.service';
import { MapService } from 'app/map/map.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() markerData: GeoJSON.GeoJsonProperties;

  isAuth: boolean;
  isAuthSub: Subscription = new Subscription();
  currentUser;
  currentUserSub: Subscription = new Subscription();
  icons;
  mode: string;

  constructor(
    private authService: AuthService,
    private iconsService: IconsService,
    private mapService: MapService
  ) {
    this.isAuth = false;
    this.currentUser = null;
    this.icons = iconsService.getIcons();
    this.mode = 'view';
  }

  ngOnInit(): void {
    this.isAuthSub = this.authService.getAuthStatusListener().subscribe(status => {
      console.log('#detailsComponent -> ngOnInit() -> status:', status);
      this.isAuth = status;
    });
    this.isAuth = this.authService.getIsAuth();
    this.currentUserSub = this.authService.getCurrentUser().subscribe(user => {
      console.log('#detailsComponent -> ngOnInit() -> user:', user);
      this.currentUser = user;
    });
    this.currentUser = this.authService.getCurrentUserRaw();
  }

  ngOnDestroy(): void {
    this.isAuthSub.unsubscribe();
    this.currentUserSub.unsubscribe();
  }

  onEdit() {
    this.mode = 'edit';
  }

  onView() {
    this.mode = 'view';
  }

  onSave(formData) {
    let id = this.markerData.id;
    let oldData = this.markerData;
    let newData = formData.value;
    delete oldData.id;
    newData.map = oldData.map;
    if (JSON.stringify(newData) == JSON.stringify(oldData)) {
      if (environment.debug) console.log('#detailsComponent -> onSave(): No change in record ', id);
      this.mode = 'view';
    } else {
      if (environment.debug) console.log('#detailsComponent -> onSave(): Updating record ', id, newData);
      this.mapService.putGeoJson(id, newData);
      this.mode = 'view';
    }
  }
    

}
