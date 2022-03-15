import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    this.isLoading = false;
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
