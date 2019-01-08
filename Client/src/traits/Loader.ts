import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {LoadingController, Loading} from "ionic-angular";

@Injectable()
export class Loader {

  loader: Loading;
  displaying: boolean;

  constructor( public http: HttpClient, public loadingCtrl: LoadingController ){
    this.displaying = false;
  }

  present(msg: string = "Espere por favor...", dismiss: boolean = false){
    this.loader = this.loadingCtrl.create({
      showBackdrop: dismiss,
      enableBackdropDismiss: dismiss,
      content: msg,
    });
    this.loader.present();
    this.displaying = true;
  }

  dismiss(){
    if(this.displaying)
      this.loader.dismiss();

    this.displaying = false;
  }

}
