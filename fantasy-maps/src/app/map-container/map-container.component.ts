import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {

  isLoading: boolean = true;
  title = 'fantasy-maps';
  //mapId2 = 'highrock';
  //mapId = 'forgotten-realms';
  mapId: string;
  markerData: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mapId = this.route.snapshot.paramMap.get('mapId');
  }

  changeMap(id: string) {
    this.isLoading = true;
    this.mapId = id;
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  displayDetails(data) {
    if (environment.debug) console.log('#mapContainerComponent -> displayDetails() -> data: ', data);
    this.markerData = data;
  }

}
