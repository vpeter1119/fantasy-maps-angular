import { Injectable } from '@angular/core';
import {
  faBars,
  faMap,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faPen,
  faEye
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  icons = {
    menu: faBars,
    map: faMap,
    login: faSignInAlt,
    logout: faSignOutAlt,
    user: faUser,
    edit: faPen,
    view: faEye
  }

  constructor() { }

  getIcons() {
    return this.icons;
  }

}
