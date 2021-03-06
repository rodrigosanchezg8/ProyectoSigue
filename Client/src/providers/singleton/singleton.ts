import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {NativeStorage} from "@ionic-native/native-storage";
import {NavController, Platform} from "ionic-angular";

@Injectable()
export class Singleton {

  guestHeaders: object;
  authHeaders: object;
  API: string;

  constructor(public http?: HttpClient, private nativeStorage?: NativeStorage, private platform?: Platform,
              protected injector?: Injector) {
     this.API = "https://morning-escarpment-15864.herokuapp.com/";
  }

  setGuestHeaders() {
    if(this.guestHeaders === undefined) {
      return this.guestHeaders = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        })
      };
    }
    return this.guestHeaders;
  }

  setAuthHeaders(token) {
    if(this.authHeaders === undefined){
      return this.authHeaders = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    }
    return this.authHeaders;
  }

  getAuthHeaders() {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.nativeStorage.getItem('session')
        .then(res => {
          resolve(this.setAuthHeaders(res.token));
        })
        .catch(e => reject(e));
      });
    })
  }

  post(url, data, auth = true) {
    return new Promise((resolve, reject) => {
      if (auth) {
        this.getAuthHeaders()
        .then(headers => {
          resolve(this.http.post(this.API + url, data, headers));
        })
        .catch(e => reject(e));
      } else {
        resolve(this.http.post(this.API + url, data, this.setGuestHeaders()))
      }
    });
  }

  get(url, auth = true) {
    return new Promise((resolve, reject) => {
      if (auth) {
        this.getAuthHeaders()
        .then(headers => {
          resolve(this.http.get(this.API + url, headers));
        })
        .catch(e => reject(e));
      } else {
        resolve(this.http.get(this.API + url, this.setGuestHeaders()));
      }
    });
  }

  put(url, data, auth = true) {
    return new Promise((resolve, reject) => {
      if (auth) {
        this.getAuthHeaders()
        .then(headers => {
          resolve(this.http.put(this.API + url, data, headers));
        })
        .catch(e => reject(e));
      } else {
        resolve(this.http.put(this.API + url, data, this.setGuestHeaders()));
      }
    });
  }

  delete(url, auth = true) {
    return new Promise((resolve, reject) => {
      if (auth) {
        this.getAuthHeaders()
        .then(headers => {
          resolve(this.http.delete(this.API + url, headers));
        })
        .catch(e => reject(e));
      } else {
        resolve(this.http.delete(this.API + url, this.setGuestHeaders()));
      }
    });
  }

  get navCtrl(): NavController {
    return this.injector.get(NavController);
  }

}
