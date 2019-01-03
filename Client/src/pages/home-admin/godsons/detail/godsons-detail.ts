import { Component } from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  App, PopoverController
} from 'ionic-angular';
import { GodsonProvider } from '../../../../providers/godson/godson';
import {GodsonDetailPopoverPage} from "./popover/godson-detail-popover";

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
    public viewCtrl: ViewController,
    private popoverCtrl: PopoverController
  ) {
    this.godson = this.navParams.data;
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodsonDetailPopoverPage, {  godson: this.godson });
    popover.present({
      ev: event,
    });
  }

}
