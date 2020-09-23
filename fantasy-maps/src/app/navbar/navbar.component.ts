import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { faBars, faMap } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() mapClicked = new EventEmitter<string>();

  debug = !environment.production;
  menuIcon = faBars;
  mapsIcon = faMap;

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  GoTo(path: string) {
    this.router.navigate([path]);
  }

  onClick(path: string) {
    this.mapClicked.emit(path);
  }

}
