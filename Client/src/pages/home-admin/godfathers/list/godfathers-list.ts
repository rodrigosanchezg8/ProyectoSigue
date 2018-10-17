import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {GodfathersPopoverPage} from "./godfathers-popover/godfathers-popover";
import {GodfathersDetailPage} from "../detail/godfathers-detail";
import {GodfatherProvider} from "../../../../providers/godfather/godfather";
import {GodfatherTopicsListPage} from "../../../topics/list/godfather-topics-list";
import {Godfather} from "../../../../models/godfather";

@IonicPage()
@Component({
  selector: 'page-godfathers',
  templateUrl: 'godfathers-list.html',
})
export class GodfathersPage {

  godfathers: Godfather[] = [];
  listDisplayMessage: string;

  godfathersDetailPage = GodfathersDetailPage;
  godfatherTopicsListPage = GodfatherTopicsListPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              private godfatherProvider: GodfatherProvider) {}

  ionViewDidEnter(){
    console.log('ionViewDidEnter GodfathersPage');
    this.fillGodfathers();
  }

  fillGodfathers(){
    this.listDisplayMessage = "Cargando padrinos...";
    this.godfatherProvider.getGodfathers().then((observable: any) => {
      observable.subscribe((data: Godfather[]) => {
        this.godfathers = data;
        this.listDisplayMessage = this.godfathers.length === 0 ? "Aún no has agregado padrinos." : "";
      });
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodfathersPopoverPage);
    popover.present({
      ev: event
    });
  }

}
