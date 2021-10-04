import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  apiRoot = environment.apiRoot;
  apiUrl = this.apiRoot + '/auth';

  private isAuthenticated = false;
  private isAdmin = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  currentUser;
  currentUserListener = new Subject();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getCurrentUser() {
    return this.currentUserListener.asObservable();
  }

  getCurrentUserRaw() {
    return this.currentUser;
  }

  createUser(email: string, username: string, password: string) {
    const authData: AuthData = { email: email, username: username, password: password };
    this.http
      .post(this.apiUrl + '/register', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(username: string, password: string) {
    const authData = { username: username, password: password };
    return new Promise((resolve,reject) => {
      this.http
        .post<{ token: string; expiresIn: number, userData, userId: string, isAdmin: boolean }>(
          this.apiUrl + '/login',
          authData
        )
        .subscribe(response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.isAdmin = response.isAdmin;
            this.currentUser = response.userData;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.adminStatusListener.next(this.isAdmin);
            this.currentUserListener.next(this.currentUser);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 3600);
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            resolve(this.isAuthenticated);
          } else {
            reject();
          }
        });
    })
  }

  autoAuthUser(): boolean {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return false;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      //this.isAdmin = response.isAdmin;
      //this.currentUser = response.userData;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 10000);
      this.authStatusListener.next(true);
      //this.adminStatusListener.next(this.isAdmin);
      //this.currentUserListener.next(this.currentUser);
      return true;
    }
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.isAdmin = false;
      this.adminStatusListener.next(false);
      this.userId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      resolve(!this.isAuthenticated);
    });
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
