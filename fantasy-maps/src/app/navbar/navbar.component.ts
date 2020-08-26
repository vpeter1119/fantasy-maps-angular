import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  debug = !environment.production;

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  GoTo(path: string) {
    this.router.navigate([path]);
  }

}
