import {Component} from '@angular/core';
import {Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NewsListPage} from "../pages/news/list/news-list";
import {FcmProvider} from "../providers/fcm/fcm";
import {tap} from "rxjs/operators";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = NewsListPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              fcm: FcmProvider,
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

    });
  }
}
