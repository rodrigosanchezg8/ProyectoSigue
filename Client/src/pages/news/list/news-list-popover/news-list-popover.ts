import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController, App} from 'ionic-angular';
import {LoginPage} from '../../../login/login';
import {Godfather} from "../../../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";
import {NewsListPage} from '../news-list';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Acciones</ion-list-header>
        <div *ngIf="sessionUser === undefined">
          <button ion-item (click)="pushLogin()">Iniciar sesion</button>
        </div>
    </ion-list>
  `
})
export class NewsListPopoverPage {

  sessionUser: Godfather;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
              private nativeStorage: NativeStorage, public appCtrl: App) {
    this.getSessionUser();
  }

  getSessionUser(){
    if (this.sessionUser === undefined) {
      this.nativeStorage.getItem("session").then(res => {
        this.sessionUser = res.user !== undefined ? res.user : null;
        console.log(this.sessionUser);
      }).catch(e => console.log(e));
    }
  }

  pushLogin() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getActiveNav().push(LoginPage);
    });
  }

  logout() {
    this.viewCtrl.dismiss().then(() => {
      this.nativeStorage.remove("session");
      this.sessionUser = undefined;
      this.appCtrl.getActiveNav().push(NewsListPage);
    }).catch(e => console.log(e));
  }

}
