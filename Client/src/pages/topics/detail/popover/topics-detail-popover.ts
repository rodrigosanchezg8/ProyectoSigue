import { Component } from '@angular/core';
import {Events, IonicPage, NavController, ViewController} from 'ionic-angular';

/**
 * Generated class for the TopicsDetailPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  template: `<ion-list>
    <ion-list-header>Acciones</ion-list-header>
    <button ion-item (click)="listSharedFiles()">Ver archivos compartidos</button>
  </ion-list>`
})
export class TopicsDetailPopoverPage {

  constructor(public navCtrl: NavController, private events: Events, private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopicsDetailPopoverPage');
  }

  listSharedFiles(){
    this.viewCtrl.dismiss().then(() => {
      this.events.publish('thread-files:list');
    });
  }

}
