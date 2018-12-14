import {Component, ViewChild} from '@angular/core';
import { NavController, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NewsListPage} from "../pages/news/list/news-list";
import {FcmProvider} from "../providers/fcm/fcm";
import {AdminTabsPage} from "../pages/home-admin/tabs/admin-tabs";
import {GodfatherTabsPage} from "../pages/home-godfather/tabs/godfather-tabs";
import {NativeStorage} from "@ionic-native/native-storage";
import {GodfatherTopicDetailPage} from "../pages/topics/detail/godfather-topic-detail";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myNav') navCtrl: NavController

  rootPage: any;
  openedByNotification: boolean;

  /**
   *
   * @param {FcmProvider} fcm
   * @param {NativeStorage} nativeStorage
   * @param {Platform} platform
   * @param {StatusBar} statusBar
   * @param {SplashScreen} splashScreen
   * @param {ToastController} toastCtrl
   * When the app is opened normally get the session item from native storage and set the respective rootPage
   * depending on the success or error case.
   * Also, listen to notifications of FCM with the native plugin of Ionic. If a notification is received,
   * set openedByNotification to true to indicate that no session item is required to obtain in the further lines.
   */
  constructor(fcm: FcmProvider,
              nativeStorage: NativeStorage,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              toastCtrl: ToastController) {

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      fcm.listenToNotifications().subscribe(notification => {

        if (notification.tap) {

          this.openedByNotification = true;

          nativeStorage.getItem("session").then(
            () => {
              let pushParams = {thread: JSON.parse(notification.thread)};
              this.navCtrl.push(GodfatherTopicDetailPage, pushParams);
            },
            () => {
              this.rootPage = LoginPage;
            }
          ).catch(e => console.log(e));
        }

        else {

          const toast = toastCtrl.create({
            message: notification.body,
            duration: 3000
          });
          toast.present();

        }
      });

      if (!this.openedByNotification) {

        nativeStorage.getItem("session").then(
          (res) => {
            if (res.user.role_description === 'Administrador')
              this.rootPage = AdminTabsPage;
            else
              this.rootPage = GodfatherTabsPage;
          },
          () => {
            this.rootPage = NewsListPage;
          }
        ).catch(e => console.log(e));

      }

    });
  }

}
