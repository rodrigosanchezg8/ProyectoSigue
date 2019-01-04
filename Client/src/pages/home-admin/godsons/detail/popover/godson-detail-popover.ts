import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavParams, ViewController} from 'ionic-angular';
import {NewGodsonPage} from "../../new/new-godson";
import {Godson} from "../../../../../models/godson";
import {GodsonProvider} from "../../../../../providers/godson/godson";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Navegar</ion-list-header>
      <button ion-item (click)="pushPage(NewGodsonPage)">Editar</button>
      <button ion-item (click)="removeGodson()">Eliminar</button>
    </ion-list>
  `
})
export class GodsonDetailPopoverPage {

  godson: Godson;
  NewGodsonPage = NewGodsonPage;

  constructor(public navParams: NavParams,
              private viewCtrl: ViewController,
              private appCtrl: App,
              private alertCtrl: AlertController,
              private godsonProvider: GodsonProvider) {
    this.godson = this.navParams.get('godson');
  }

  pushPage(page: any){
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getActiveNav().push(page, {
        godson: this.godson
      });
    });
  }

  removeGodson(){
      this.alertCtrl.create({
        title: '¡Atención!',
        subTitle: "¿Está seguro de eliminar el ahijado?",
        buttons: [
          {
            text: 'Sí',
            handler: () => {
              this.godsonProvider.deleteGodson(this.godson.id).then((observable:any) => {
                observable.subscribe(
                  () => {
                    this.appCtrl.getActiveNav().pop();
                  },
                  (errorResponse) => {
                    console.log(errorResponse);
                  }
                );
              });
            }
          },
          {
            text: 'No',
          }
        ]
      }).present();
    }

}
