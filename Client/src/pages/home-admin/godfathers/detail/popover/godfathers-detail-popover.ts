import {AlertController} from 'ionic-angular';
import {CallNumber} from '@ionic-native/call-number';
import {Component} from '@angular/core';
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
      <button ion-item (click)="callGodfather()">Llamar</button>
      <button ion-item (click)="eventDeleteGodfather()">Eliminar</button>
    </ion-list>
  `
})
export class GodfathersDetailPopoverPage {

  godfather: Godfather;
  godfatherTopicsListPage = GodfatherTopicsListPage;
  godfatherRegisterPage = RegisterPage;

  constructor(private alertCtrl: AlertController,
              private events: Events,
              private viewCtrl: ViewController,
              private appCtrl: App,
              public caller: CallNumber,
              public navParams: NavParams) {
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

  callGodfather(){
    if (this.godfather.phone != undefined) {
      this.caller.callNumber("+52" + this.godfather.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    } else {
      let alert = this.alertCtrl.create({
        title: 'El padrino no tiene numero de telefono',
        subTitle: 'Edite el padrino para agregar uno'
      });
      alert.present();
    }
  }

}
