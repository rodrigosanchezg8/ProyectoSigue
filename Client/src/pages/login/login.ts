import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {AdminTabsPage} from "../home-admin/tabs/admin-tabs";
import {UserProvider} from "../../providers/user/user";
import {NativeStorage} from '@ionic-native/native-storage';
import {GodfatherTabsPage} from "../home-godfather/tabs/godfather-tabs";
import {Loader} from "../../traits/Loader";
import {Socket} from "ng-socket-io";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  assets: string[] = [];
  password: string = "";
  email: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              private userProvider: UserProvider, private nativeStorage: NativeStorage, private loader: Loader,
              private socket: Socket) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    //this.adminDebugSignIn();
    this.assets['logo'] = this.userProvider.singletonService.API + "storage/assets/logo.png";
  }

  signIn() {
    let self = this;
    this.loader.present();
    this.userProvider.validateUser(this.email, this.password).then((observable: any) => {
      observable.subscribe((res) => {
        console.log(res);
        if (res["status"] == "Error") {
          this.loader.dismiss();
          self.presentResponse(res);
        }
        else {
          this.loader.dismiss();
          self.nativeStorage.setItem("session", res);
          if (res.user.role_description === 'Administrador')
            self.navCtrl.setRoot(AdminTabsPage, res);
          else
            self.navCtrl.setRoot(GodfatherTabsPage, res.user);
        }
      });
    }, (error) => {
      alert(error.toString());
      this.loader.dismiss();
      console.log(error);
    });
  }

  adminDebugSignIn(){
    // this.userProvider.login(this.email, this.password).subscribe(
    //   (success) => {
    //     console.log(success);
    //   },
    //   (error) => {
    //     console.log(error); 
    //   }
    // );
    let self = this;
    this.loader.present();
    this.userProvider.validateUser("coordinacion@proyectosigue.com.mx", "123456").then((observable: any) => {
      observable.subscribe((res) => {
      if (res["status"] == "Error") {
        this.loader.dismiss();
        self.presentResponse(res);
      }
      else {
        console.log('success request')
        this.loader.dismiss();
        console.log(this.nativeStorage);
        this.nativeStorage.setItem("session", res)
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );
        if(res.user.role_description === 'Administrador')
          self.navCtrl.setRoot(AdminTabsPage, res);
        else
          self.navCtrl.setRoot(GodfatherTabsPage, res.user);
      }
      });
    }, (error) => {
      console.log('directly to error');
      console.log(error);
      this.loader.dismiss();
    })
    .catch((err) => {
      console.log(err);
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

  pushSignUp() {
    this.navCtrl.push(RegisterPage);
  }


}
