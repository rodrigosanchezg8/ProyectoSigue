import { Component } from '@angular/core';
import {IonicPage, Events, PopoverController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GodsonProvider} from "../../../../providers/godson/godson";
import {GodsonsDetailPage} from "../detail/godsons-detail";
import {GodsonsPopoverPage} from "./popover/godsons-popover";

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

  constructor(
    public http: HttpClient, 
    private godsonProvider: GodsonProvider, 
    public popoverCtrl: PopoverController,
    public events: Events
  ) {
    this.godsonsDetailPage = GodsonsDetailPage;
    this.events.subscribe('godson:reload-list', () => {
      this.loadGodsons();
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.loadGodsons();
  }

  private loadGodsons(){
    this.godsonProvider.getGodsons().then((res: any) => {
      res.subscribe( (data:any ) => {
        this.godsons = data;
        this.godsonsList = this.godsons.map((godson) => godson);
      });
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodsonsPopoverPage);
    popover.present({
      ev: event
    });
  }

  search() {
    this.godsonsList = this.godsons.filter((godson) => godson.full_name.indexOf(this.searchValue) !== -1);
  }

}
