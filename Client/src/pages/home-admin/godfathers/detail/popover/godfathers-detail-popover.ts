import { Component } from '@angular/core';
import {IonicPage, NavParams, Events, ViewController, App} from 'ionic-angular';
import {GodfatherTopicsListPage} from "../../../../topics/list/godfather-topics-list";
import {Godfather} from "../../../../../models/godfather";
import {RegisterPage} from "../../register/register";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Navegar</ion-list-header>
      <button ion-item (click)="pushPage(godfatherTopicsListPage)">Ver temas</button>
      <button ion-item (click)="pushPage(godfatherRegisterPage)">Editar</button>
      <button ion-item (click)="eventDeleteGodfather()">Eliminar</button>
    </ion-list>
  `
})
export class GodfathersDetailPopoverPage {

  godfather: Godfather;
  godfatherTopicsListPage = GodfatherTopicsListPage;
  godfatherRegisterPage = RegisterPage;

  constructor(public navParams: NavParams,
              private events: Events,
              private viewCtrl: ViewController,
              private appCtrl: App) {
    this.godfather = this.navParams.get('godfather');
  }

  pushPage(page: any){
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getRootNav().push(page, {
        godfather: this.godfather
      });
    });
  }

  eventDeleteGodfather(){
    this.viewCtrl.dismiss().then(() => {
      this.events.publish('godfather:delete');
    });
  }

}
