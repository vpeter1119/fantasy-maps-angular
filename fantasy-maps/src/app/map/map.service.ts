import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
//import { GeoJSON } from './geojson.model';

export interface GeoJsonApiResponse {
  ok: boolean,
  count: number,
  results: GeoJSON.FeatureCollection
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  apiRoot = environment.apiRoot;
  apiUrl = this.apiRoot + '/geojson';
  geoJsonData: GeoJSON.FeatureCollection;
  geoJsonDataListener = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  fetchGeoJson(mapId: string) {
    const url = this.apiUrl + '?map=' + mapId;
    this.http.get(url).subscribe((response: GeoJsonApiResponse) => {
      if (response.ok && response.count > 0) {
        this.geoJsonData = response.results;
        this.geoJsonDataListener.next(this.geoJsonData);
      }
    });
  }

  getGeoJson(mapId: string) {
    this.fetchGeoJson(mapId);
    return this.geoJsonDataListener.asObservable();
  }

}
