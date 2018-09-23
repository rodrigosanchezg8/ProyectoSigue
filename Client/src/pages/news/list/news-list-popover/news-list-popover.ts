import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController, App} from 'ionic-angular';
import {LoginPage} from '../../../login/login';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Acciones</ion-list-header>
      <button (click)="pushLogin()">Iniciar sesión</button>
    </ion-list>
  `
})
export class NewsListPopoverPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public appCtrl: App) {
  }

  pushLogin() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getRootNav().push(LoginPage);
    });
  }

}
