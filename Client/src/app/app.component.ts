import { AdminTabsPage } from "../pages/home-admin/tabs/admin-tabs";
import { Component } from '@angular/core';
import { GodfatherTabsPage } from "../pages/home-godfather/tabs/godfather-tabs";
import { NativeStorage } from "@ionic-native/native-storage";
import { NewsListPage } from "../pages/news/list/news-list";
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(nativeStorage: NativeStorage, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
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
