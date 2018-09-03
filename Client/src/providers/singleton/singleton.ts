import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {NativeStorage} from "@ionic-native/native-storage";
import {AlertController, NavController, Platform} from "ionic-angular";
import {Godfather} from "../../models/godfather";

@Injectable()
export class Singleton {

  guestHeaders: object;
  authHeaders: object;
  API: string;

  constructor(public http?: HttpClient, private nativeStorage?: NativeStorage, private platform?: Platform,
              protected injector?: Injector) {
    console.log('Hello SingletonProvider Provider');
    this.API = "http://localhost:8010/"; // Usar esta URL para testing en plataforma BROWSER
    // this.API = "http://10.0.2.2:8010/"; // Usar esta IP para testing en plataforma EMULADOR
    this.setGuestHeaders();
    this.setAuthHeaders();
  }

  setGuestHeaders() {
    this.authHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    };
  }

  setAuthHeaders() {
      this.platform.ready().then(() => {
        this.nativeStorage.getItem("session").then(res => {
          this.authHeaders = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + res.token
            })
          };
        }).catch(e => console.log(e));
      });
  }

  post(url, data, auth = true) {
    return this.http.post(this.API + url, data, (auth) ? this.authHeaders : this.guestHeaders);
  }

  get(url, auth = true) {
    return this.http.get(this.API + url, (auth) ? this.authHeaders : this.guestHeaders);
  }

  put(url, data, auth = true) {
    return this.http.put(this.API + url, data, (auth) ? this.authHeaders : this.guestHeaders);
  }

  delete(url, auth = true) {
    return this.http.delete(this.API + url, (auth) ? this.authHeaders : this.guestHeaders);
  }

  get navCtrl(): NavController {
    return this.injector.get(NavController);
  }

}
