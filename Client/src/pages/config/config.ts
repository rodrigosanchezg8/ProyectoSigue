import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeStorage } from "@ionic-native/native-storage";
import { NewsListPage } from '../news/list/news-list';

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

  constructor(
              private nativeStorage: NativeStorage,
              public appCtrl: App,
              public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeAdminPage');
  }

  closeSession() {
      this.nativeStorage.remove("session");
      this.appCtrl.getRootNav().push(NewsListPage);
  }

}
