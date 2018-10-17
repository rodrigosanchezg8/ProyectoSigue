import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { GodfatherTopicsListPage } from "../../topics/list/godfather-topics-list";
import {Godfather} from "../../../models/godfather";
import {NewsListPage} from "../../news/list/news-list";

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

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.godfather = this.navParams.data;
  }

}
