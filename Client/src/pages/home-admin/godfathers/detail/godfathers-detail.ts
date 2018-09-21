import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  PopoverController,
  Events,
  AlertController
} from 'ionic-angular';
import {GodfathersDetailPopoverPage} from "./popover/godfathers-detail-popover";
import {GodfatherProvider} from "../../../../providers/godfather/godfather";
import {Godfather} from "../../../../models/godfather";
import {GodfatherTopicDetailPage} from "../topics/detail/godfather-topic-detail";
import {Loader} from "../../../../traits/Loader";

@IonicPage()
@Component({
  selector: 'page-godfathers-detail',
  templateUrl: 'godfathers-detail.html',
})
export class GodfathersDetailPage {

  godfather: Godfather;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              public popoverCtrl: PopoverController, private events: Events, private godfatherProvider: GodfatherProvider,
              private alertCtrl: AlertController, private loaderCtrl: Loader) {
    this.godfather = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodfathersDetailPage');
  }

  ionViewDidEnter(){
    this.subscribeDeleteGodfather();
  }

  ionViewDidLeave(){
    this.events.unsubscribe('godfather:delete');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodfathersDetailPopoverPage, {  godfather: this.godfather });
    popover.present({
      ev: event,
    });
  }

  subscribeDeleteGodfather(){
    this.events.subscribe('godfather:delete', () => {
      this.deleteGodfather();
    })
  }

  deleteGodfather(){
    this.alertCtrl.create({
      title: '¡Atención!',
      subTitle: "¿Está seguro de eliminar el padrino?",
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.loaderCtrl.present();
            this.godfatherProvider.deleteGodfather(this.godfather.id).then((observable:any) => {
              observable.subscribe(response => {
                console.log(response);
                this.loaderCtrl.dismiss();
                this.navCtrl.pop();
              }, error => {
                this.loaderCtrl.dismiss();
                console.log(error);
              })
            })
          }
        },
        {
          text: 'No',
        }
      ]
    }).present();
  }

}
