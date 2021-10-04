import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    //const isAuth = this.authService.getIsAuth();
    // return true if auth or false if not
    if (this.authService.getIsAuth()) {
      // use data from service
      return true;
      //this.router.navigate(['/login']);
    } else if (this.authService.autoAuthUser()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    //return isAuth;
  }
}
