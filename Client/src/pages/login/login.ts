import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {RegisterPage} from "../home-admin/godfathers/register/register";
import {AdminTabsPage} from "../home-admin/tabs/admin-tabs";
import {UserProvider} from "../../providers/user/user";
import {NativeStorage} from '@ionic-native/native-storage';
import {GodfatherTabsPage} from "../home-godfather/tabs/godfather-tabs";
import {Loader} from "../../traits/Loader";
import {FcmProvider} from "../../providers/fcm/fcm";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  assets: string[] = [];
  password: string = "";
  email: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private userProvider: UserProvider,
              private nativeStorage: NativeStorage,
              private loader: Loader,
              private fcmProvider: FcmProvider) {
  }

  ionViewDidLoad() {
    this.assets['logo'] = this.userProvider.singletonService.API + "storage/assets/logo.png";
  }

  signIn() {
    this.loader.present();
    this.userProvider.validateUser(this.email, this.password).then((observable: any) => {
      observable.subscribe((res) => {
        this.handleLoginResponse(res);
      });
    }, (error) => {
      alert(error.toString());
      this.loader.dismiss();
      console.log(error);
    });
  }

  adminDebugSignIn() {
    this.loader.present();
    this.userProvider.validateUser("coordinacion@proyectosigue.com.mx", "123456").then((observable: any) => {
      observable.subscribe((res) => {
        this.handleLoginResponse(res);
      });
    }, (error) => {
      console.log(error);
      this.loader.dismiss();
    })
      .catch((err) => {
        console.log(err.toJSON());
      });
  }

  handleLoginResponse(loginRes) {
    if (loginRes["status"] == "Error") {
      this.loader.dismiss();
      this.presentResponse(loginRes);
    }
    else {

      this.nativeStorage.setItem("session", loginRes);

      this.loader.dismiss();

      this.fcmProvider.getToken().then(fcmRes => {
        this.userProvider.updateFCMToken(loginRes.user.id, fcmRes).then((observable: any) => {
            observable.subscribe(updateRes => console.log(updateRes))
          });
      });

      loginRes.user.role_description === 'Administrador' ?
        this.navCtrl.setRoot(AdminTabsPage) :
        this.navCtrl.setRoot(GodfatherTabsPage);

    }
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

  pushSignUp() {
    this.navCtrl.push(RegisterPage);
  }
}
