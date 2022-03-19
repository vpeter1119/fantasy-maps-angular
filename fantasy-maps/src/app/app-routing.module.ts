import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapContainerComponent } from './map-container/map-container.component';
import { MapNewComponent } from './map-new/map-new.component';
import { MapComponent } from './map/map.component';


const routes: Routes = [
  { path: '', redirectTo: 'map/forgotten-realms', pathMatch: 'full' },
  { path: 'map', redirectTo: 'map/forgotten-realms', pathMatch: 'full' },
  { path: 'maps', redirectTo: 'map/forgotten-realms', pathMatch: 'full' },
  { path: 'map/:mapId', component: MapContainerComponent },
  { path: 'map-new', component: MapNewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
