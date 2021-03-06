import {
  ActionSheetController,
  AlertController,
  App, Events,
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { CreateNewPage } from '../create/create-new';
import { Component } from '@angular/core';
import { Godfather } from "../../../models/godfather";
import { Loader } from "../../../traits/Loader";
import { NativeStorage } from "@ionic-native/native-storage";
import { NewProvider } from '../../../providers/new/new';

/**
 * Generated class for the GodsonsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
})
export class NewsDetailPage {

  new: any;
  sessionUser: Godfather;

  constructor(
    private loaderCtrl: Loader,
    private nativeStorage: NativeStorage,
    private newProvider: NewProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
  ) {
    this.new = this.navParams.data;
  }

  ionViewDidLoad() {
    if (this.sessionUser === undefined) {
        this.nativeStorage.getItem("session").then(res => {
          this.sessionUser = res.user !== undefined ? res.user : null;
          console.log(this.sessionUser);
      }).catch(e => console.log(e));
    }
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acción',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.viewCtrl.dismiss().then(() => {
              this.appCtrl.getActiveNav().push(CreateNewPage, {
                new: this.new
              });
            });
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            let self = this;
            this.alertCtrl.create({
              title: '¡Atención!',
              subTitle: "¿Está seguro de eliminar la noticia?",
              buttons: [
                {
                  text: 'Sí',
                  handler: () => {
                    this.loaderCtrl.present();
                    this.newProvider.deleteNew(this.new.id).then((observable: any) => {
                      observable.subscribe(
                        (successResponse) => {
                          this.loaderCtrl.dismiss();
                          this.events.publish('new:reload-list');
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
                  text: 'No',
                }
              ]
            }).present();
          }
        }
      ]
    });
    actionSheet.present();
  }

}
