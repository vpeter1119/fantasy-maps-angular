import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoading: boolean = true;
  title = 'fantasy-maps';
  mapId2 = 'highrock';
  mapId = 'forgotten-realms';
  markerData: string;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  changeMap(id: string) {
    this.isLoading = true;
    this.mapId = id;
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  displayDetails(data) {
    this.markerData = data;
  }

}
