import { Component } from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  App
} from 'ionic-angular';
import { NewGodsonPage } from '../new/new-godson';
import { GodsonProvider } from '../../../../providers/godson/godson';

/**
 * Generated class for the GodsonsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-godsons-detail',
  templateUrl: 'godsons-detail.html',
})
export class GodsonsDetailPage {

  godson: any;

  constructor(
    private godsonProvider: GodsonProvider,
    public actionSheetCtrl: ActionSheetController,
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.godson = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodsonsDetailPage');
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acción',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.viewCtrl.dismiss().then(() => {
              this.appCtrl.getRootNav().push(NewGodsonPage, {
                godson: this.godson
              });
            });
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.godsonProvider.deleteGodson(this.godson.id)
            .then((observable:any) => {
              observable.subscribe(
                (successResponse) => {
                  this.navCtrl.pop();
                },
                (errorResponse) => {
                  console.log(errorResponse);
                }
              );
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
