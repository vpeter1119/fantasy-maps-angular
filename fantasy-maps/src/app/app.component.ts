import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fantasy-maps';
  mapId = 'faerun';

  changeMap(id: string) {
    this.mapId = id;
  }
}
