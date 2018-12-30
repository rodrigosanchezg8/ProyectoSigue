import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController} from 'ionic-angular';
import {Loader} from "../../traits/Loader";
import {UserProvider} from "../../providers/user/user";

@IonicPage()
@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.html',
})

export class ResetPasswordPage {

  assets: string[] = [];
  email: string = "";

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private userProvider: UserProvider,
              private loader: Loader) {
  }

  ionViewDidLoad() {
    this.assets['logo'] = this.userProvider.singletonService.API + "storage/assets/logo.png";
  }

  sendResetPasswordLink() {
    this.loader.present();
    this.userProvider.sendResetPasswordLink(this.email).then(
      (observable: any) => {
        observable.subscribe((res) => {
          this.loader.dismiss();
          this.presentResponse(res);
        });
      },
      (error) => {
        console.log(error);
        this.loader.dismiss();
      }
    )
    .catch((err) => {
      console.log(err.toJSON());
    });
  }

  presentResponse(response) {
    let alert = this.alertCtrl.create({
      title: response["status"],
      subTitle: response["message"],
      buttons: [
        {
          text: 'OK',
        }
      ]
    });
    alert.present();
  }

}
