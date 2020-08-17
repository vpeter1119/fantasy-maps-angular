import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';


const routes: Routes = [
  { path: '', redirectTo: '/fantasy-maps/forgotten-realms', pathMatch: 'full' },
  { path: 'fantasy-maps/:index', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
