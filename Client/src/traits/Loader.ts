import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {LoadingController, Loading} from "ionic-angular";

@Injectable()
export class Loader {

  loader: Loading;

  constructor( public http: HttpClient, public loadingCtrl: LoadingController ){ }

  present(msg: string = "Espere por favor..."){
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }

  dismiss(){
    this.loader.dismiss();
  }

}
