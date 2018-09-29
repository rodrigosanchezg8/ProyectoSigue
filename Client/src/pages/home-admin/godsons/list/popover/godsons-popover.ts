import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ViewController, App } from 'ionic-angular';
import { NewGodsonPage } from '../../new/new-godson';

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
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodsonsPopoverPage');
  }

  pushCreateGodson() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getRootNav().push(NewGodsonPage);
    });
  }

}
