import {Component} from '@angular/core';
import {Platform, Toast, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NewsListPage} from "../pages/news/list/news-list";
import {FcmProvider} from "../providers/fcm/fcm";
import {tap} from "rxjs/operators";
import { AdminTabsPage } from "../pages/home-admin/tabs/admin-tabs";
import { GodfatherTabsPage } from "../pages/home-godfather/tabs/godfather-tabs";
import { NativeStorage } from "@ionic-native/native-storage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;

  constructor(fcm: FcmProvider,
              nativeStorage: NativeStorage,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              toastCtrl: ToastController) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      fcm.listenToNotifications().pipe(
        tap(msg => {
          const toast = toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      ).subscribe();

      nativeStorage.getItem("session").then(
        (res) => {
          if (res.user.role_description === 'Administrador')
            this.rootPage = AdminTabsPage;
          else
            this.rootPage = GodfatherTabsPage;
        },
        (error) => {
          this.rootPage = NewsListPage;
        }
      ).catch(e => console.log(e));
    });
  }
}
