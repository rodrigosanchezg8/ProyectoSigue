import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ViewController, App } from 'ionic-angular';
import { NewGodsonPage } from '../../new/new-godson';
import { Godson } from '../../../../../models/godson';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Navegar</ion-list-header>
      <button ion-item (click)="pushCreateGodson()">Agregar ahijado</button>
    </ion-list>
  `
})
export class GodsonsPopoverPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App
  ) {}

  pushCreateGodson() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getActiveNav().push(NewGodsonPage);
    });
  }

}
