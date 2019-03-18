import {App, IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Godfather} from "../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";
import {NewsListPage} from '../news/list/news-list';
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the HomeAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  sessionUser: Godfather;

  constructor(
    private nativeStorage: NativeStorage,
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    public userProvider: UserProvider
  ) {
  }

  ionViewWillEnter() {
    let self = this;
    this.platform.ready().then(() => {
      this.nativeStorage.getItem("session").then(
        (res) => {
          this.sessionUser = res.user !== undefined ? res.user : null;
        },
        (error) => {
          console.log("There was an error obtaining sessionUser (configPage)");
        }
      ).catch(e => console.log(e));
    });
  }

  closeSession() {
    this.userProvider.updateFCMToken(this.sessionUser.id, null).then((observable: any) => {
      observable.subscribe(updateRes => console.log(updateRes))
      this.nativeStorage.remove("session").then(() => {
        this.appCtrl.getRootNav().setRoot(NewsListPage)
      }).catch((error) => {
        console.log(error);
      });
    });
  }

}
