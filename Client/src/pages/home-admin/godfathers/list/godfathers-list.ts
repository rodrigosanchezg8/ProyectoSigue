import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController, ViewController, App} from 'ionic-angular';
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
  godfatherList: any; 
  listDisplayMessage: string;
  searchValue: string;

  godfathersDetailPage = GodfathersDetailPage;
  godfatherTopicsListPage = GodfatherTopicsListPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              private godfatherProvider: GodfatherProvider,
              public viewCtrl: ViewController,
              public appCtrl: App
              ) {}

  ionViewDidEnter(){
    console.log('ionViewDidEnter GodfathersPage');
    this.fillGodfathers();
  }

  fillGodfathers(){
    this.listDisplayMessage = "Cargando padrinos...";
    this.godfatherProvider.getGodfathers().then((observable: any) => {
      observable.subscribe((data: Godfather[]) => {
        this.godfathers = data;
        this.godfatherList = data;
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

  search() {
    if(this.searchValue) {
      console.log(this.searchValue);
      this.godfatherList = this.godfathers.filter(
        (godfather) => godfather.full_name.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
    } else {
      this.fillGodfathers();
    }
  }

}
