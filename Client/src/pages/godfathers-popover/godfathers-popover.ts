import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, App} from 'ionic-angular';
import {RegisterPage} from "../register/register";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="pushSignUp()">Registrar padrino</button>
    </ion-list>
  `
})
export class GodfathersPopoverPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public appCtrl: App) {
  }

  pushSignUp() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getRootNav().push(RegisterPage);
    });
  }

}
