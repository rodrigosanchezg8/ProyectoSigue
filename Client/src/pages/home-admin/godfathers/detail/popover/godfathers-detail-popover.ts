import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events, ViewController} from 'ionic-angular';
import {GodfatherTopicsListPage} from "../../topics/list/godfather-topics-list";
import {Godfather} from "../../../../../models/godfather";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Navegar</ion-list-header>
      <button ion-item [navPush]="godfatherTopicsListPage" [navParams]="godfather">Ver temas</button>
     
      <button ion-item (click)="eventDeleteGodfather()">Eliminar</button>
    </ion-list>
  `
})
export class GodfathersDetailPopoverPage {

  godfather: Godfather;
  godfatherTopicsListPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events, private viewCtrl: ViewController) {
    this.godfatherTopicsListPage = GodfatherTopicsListPage;
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
