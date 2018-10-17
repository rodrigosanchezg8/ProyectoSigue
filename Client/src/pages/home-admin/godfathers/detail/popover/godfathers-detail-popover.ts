import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events, ViewController} from 'ionic-angular';
import {GodfatherTopicsListPage} from "../../../../topics/list/godfather-topics-list";
import {Godfather} from "../../../../../models/godfather";
import {RegisterPage} from "../../register/register";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Navegar</ion-list-header>
      <button ion-item [navPush]="godfatherTopicsListPage" [navParams]="godfather">Ver temas</button>
      <button ion-item [navPush]="godfatherRegisterPage" [navParams]="{godfather: godfather }">Editar</button>
      <button ion-item (click)="eventDeleteGodfather()">Eliminar</button>
    </ion-list>
  `
})
export class GodfathersDetailPopoverPage {

  godfather: Godfather;
  godfatherTopicsListPage = GodfatherTopicsListPage;
  godfatherRegisterPage = RegisterPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events, private viewCtrl: ViewController) {
    this.godfather = this.navParams.get('godfather');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodfathersDetailPopoverPage');
  }

  eventDeleteGodfather(){
    this.viewCtrl.dismiss().then(() => {
      this.events.publish('godfather:delete');
    });
  }

}
