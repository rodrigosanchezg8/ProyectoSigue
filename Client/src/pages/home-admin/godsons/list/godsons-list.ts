import { Component } from '@angular/core';
import {IonicPage, Events, PopoverController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GodsonProvider} from "../../../../providers/godson/godson";
import {GodsonsDetailPage} from "../detail/godsons-detail";
import {GodsonsPopoverPage} from "./popover/godsons-popover";
import { GodfatherProvider } from '../../../../providers/godfather/godfather';

/**
 * Generated class for the GodsonsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-godsons',
  templateUrl: 'godsons-list.html',
})
export class GodsonsPage {

  godsons: any;
  godsonsList: any;
  godsonsDetailPage: any;
  searchValue: string;
  godfatherId: string;

  constructor(
    public http: HttpClient, 
    private godsonProvider: GodsonProvider,
    private godfatherProvider: GodfatherProvider,
    public popoverCtrl: PopoverController,
    public events: Events,
    public navParams: NavParams
  ) {
    this.godsonsDetailPage = GodsonsDetailPage;
    this.events.subscribe('godson:reload-list', () => {
      this.loadGodsons();
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.godfatherId = this.navParams.get('godfatherId');
    this.loadGodsons(this.godfatherId);
  }

  private loadGodsons(godfatherId: string = undefined){
    if (this.godfatherId) { 
      this.godfatherProvider.getGodsonsByGodfatherId(godfatherId).then((res: any) => {
        res.subscribe( (data:any ) => {
          this.godsons = data.data;
          this.godsonsList = this.godsons.map((godson) => godson);
        });
      });
    } else {
      this.godsonProvider.getGodsons().then((res: any) => {
        res.subscribe( (data:any ) => {
          this.godsons = data;
          this.godsonsList = this.godsons.map((godson) => godson);
        });
      });
    }
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodsonsPopoverPage);
    popover.present({
      ev: event
    });
  }

  search() {
      this.godsonsList = this.godsons.filter(
        (godson) => godson.full_name.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
  }

}
