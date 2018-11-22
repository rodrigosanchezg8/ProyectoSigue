import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  PopoverController,
  Events,
  AlertController,
  ViewController,
  App
} from 'ionic-angular';
import {GodfathersDetailPopoverPage} from "./popover/godfathers-detail-popover";
import {GodfatherProvider} from "../../../../providers/godfather/godfather";
import {Godfather} from "../../../../models/godfather";
import {Loader} from "../../../../traits/Loader";
import { GodsonsPage } from '../../godsons/list/godsons-list';

@IonicPage()
@Component({
  selector: 'page-godfathers-detail',
  templateUrl: 'godfathers-detail.html',
})
export class GodfathersDetailPage {

  godfather: Godfather;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public actionSheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController, 
    private events: Events, 
    private godfatherProvider: GodfatherProvider,
    private alertCtrl: AlertController, 
    private loaderCtrl: Loader,
    public viewCtrl: ViewController,
    public appCtrl: App) {
    this.godfather = this.navParams.data;
  }


  ionViewDidEnter(){
    this.subscribeDeleteGodfather();
    this.subscribeUpdatedGodfather();
  }

  ionViewDidLeave(){
    this.events.unsubscribe('godfather:delete');
    this.events.unsubscribe('godfather:updated');
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

  subscribeUpdatedGodfather(){
    this.events.subscribe('godfather:updated', (id) => {
      this.godfatherProvider.getGodfather(id).then((observable: any) => {
        observable.subscribe(res => {
          console.log(res);
          this.godfather = res.godfather;
        });
      })
    });
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

  viewGodsons() {
    this.viewCtrl.dismiss().then(() => {
      this.appCtrl.getRootNav().push(GodsonsPage, {
        godson: this.godfather.id
      });
    });
  }

}
