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

  godson: object;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public appCtrl: App
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
            console.log('Eliminar');
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
