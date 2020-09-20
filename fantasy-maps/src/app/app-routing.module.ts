import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';


const routes: Routes = [
  //{ path: '', redirectTo: 'forgotten-realms', pathMatch: 'full' },
  { path: ':index', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
