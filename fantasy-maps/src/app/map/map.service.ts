import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { GeoJSONOptions, LatLng } from 'leaflet';
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
  currentMap: string;
  contextPosition: LatLng;

  constructor(
    private http: HttpClient
  ) { }

  fetchGeoJson(mapId: string) {
    this.currentMap = mapId;
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

  postGeoJson(data) {
    const url = this.apiUrl + '?token=Mellon30190113';
    this.http.post<{ok: boolean}>(url, data).subscribe((response) => {
      if (environment.debug) console.log('#mapService -> postGeoJson() reponse: ', response);
      if (response.ok) {
        this.fetchGeoJson(this.currentMap);
        return true;
      } else {
        return false;
      }
    })
  }

  putGeoJson(id: string, data: GeoJSON.GeoJsonProperties) {
    const url = this.apiUrl + '/' + id;
    if (environment.debug) console.log('#mapService -> putGeoJson(',id,data,')');
    this.http.put<{ok: boolean, message: string}>(url, data).subscribe(response => {
      if (environment.debug) console.log('#mapService -> putGeoJson() reponse: ', response);
      if (response.ok) {
        this.fetchGeoJson(this.currentMap);
        return true;
      } else {
        return false;
      }
    });
  }

  getContextPosition(): LatLng {
    return this.contextPosition;
  }
  
  setContextPosition(position: LatLng): void {
    console.log('#mapService -> setContextPosition() -> position: ', position);
    this.contextPosition = position;
  }

  

  LatLngToCoordinates(original: LatLng) {
    //Convert latLng to map-specific coordinates
    let coordinates = [original.lng, -original.lat];
    return coordinates;
  }

  CoordinatesToLatLng(original: number[]) {
    //Convert map-specific coordinates to standard Leaflet LatLng
    let latlng = new LatLng(-original[1], original[0]);
    return latlng;
  }

}
