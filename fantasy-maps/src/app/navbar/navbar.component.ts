import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { faBars, faMap } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/auth.service';
import { IconsService } from '../common/icons.service';
import { Subscription } from 'rxjs';
import { MapService } from 'app/map/map.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() mapClicked = new EventEmitter<string>();

  debug = !environment.production;
  icons;
  isAuth: boolean = false;
  currentUser;
  currentUserSub: Subscription = new Subscription();
  maps;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public authService: AuthService,
    public iconsService: IconsService,
    private mapService: MapService
  ) {
    this.icons = this.iconsService.getIcons();
  }

  ngOnInit(): void {
    if (this.authService.getIsAuth()) {
      console.log('#navbarComponent -> ngOnInit() \n Auth data from service used.');
      this.isAuth = true;
      this.currentUserSub = this.authService.getCurrentUser().subscribe(userData => this.currentUser = userData);
      this.currentUser = this.authService.getCurrentUserRaw();
      console.log('#navbarComponent -> ngOnInit() -> currentUser: ', this.currentUser);
    } else if (this.authService.autoAuthUser()) {
      console.log('#navbarComponent -> ngOnInit() \n Automatic login success.');
      this.isAuth = true;
      this.currentUserSub = this.authService.getCurrentUser().subscribe(userData => this.currentUser = userData);
      this.currentUser = this.authService.getCurrentUserRaw();
      console.log('#navbarComponent -> ngOnInit() -> currentUser: ', this.currentUser);
    } else {
      console.log('#navbarComponent -> ngOnInit() \n No auth data.');
      this.isAuth = false;
      this.currentUser = null;
    }
    this.maps = this.mapService.getMaps();
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

  GoTo(path: string) {
    this.router.navigate([path]);
  }

  onOpenLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.isAuth = this.authService.getIsAuth();
      this.currentUser = this.authService.getCurrentUserRaw();
      console.log('#navbarComponent -> onOpenLogin() -> currentUser: ', this.currentUser);
    });
  }

  onLogout() {
    this.authService.logout().then((ok) => {
      this.isAuth = !ok;
    });
  }

  onClick(path: string) {
    this.mapClicked.emit(path);
  }

}
