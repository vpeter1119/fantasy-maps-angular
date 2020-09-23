import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { faBars, faMap } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/auth.service';
import { IconsService } from '../common/icons.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() mapClicked = new EventEmitter<string>();

  debug = !environment.production;
  icons;
  isAuth: boolean = false;
  currentUser;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public authService: AuthService,
    public iconsService: IconsService
  ) {
    this.icons = this.iconsService.getIcons();
  }

  ngOnInit(): void {
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
