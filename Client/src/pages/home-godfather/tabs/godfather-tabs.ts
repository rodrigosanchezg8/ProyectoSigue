import { ConfigPage } from '../../config/config';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { GodfatherTopicsListPage } from "../../topics/list/godfather-topics-list";
import {Godfather} from "../../../models/godfather";
import {NewsListPage} from "../../news/list/news-list";
import {NativeStorage} from "@ionic-native/native-storage";

/**
 * Generated class for the GodfatherTabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-godfather-tabs',
  templateUrl: 'godfather-tabs.html'
})
export class GodfatherTabsPage {

  godfather: Godfather;
  newsRoot = NewsListPage;
  topicsRoot = GodfatherTopicsListPage;
  configRoot = ConfigPage;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private nativeStorage: NativeStorage,
    private platform: Platform) {

    this.platform.ready().then((ready) => {
        this.nativeStorage.getItem("session").then(res => {
          this.godfather = res.user;
        }).catch(e => console.log(e));
    });

  }

}
