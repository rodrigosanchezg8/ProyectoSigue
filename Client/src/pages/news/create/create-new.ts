import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  Events, Platform
} from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { Loader } from "../../../traits/Loader";
import { NativeStorage } from "@ionic-native/native-storage";
import { New } from "../../../models/new";
import { NewProvider } from '../../../providers/new/new';
import {Godfather} from "../../../models/godfather";

@IonicPage()
@Component({
    selector: 'page-create-new',
    templateUrl: 'create-new.html',
})
export class CreateNewPage {

    new: New;
    imageURI: any;
    imageData: any;
    sessionUser: Godfather;

    constructor(
      private camera: Camera,
      private loader: Loader,
      private newProvider: NewProvider,
      public alertCtrl: AlertController,
      public events: Events,
      public navCtrl: NavController,
      public navParams: NavParams,
      private nativeStorage: NativeStorage,
      private platform: Platform
    ) {
        this.new = navParams.get('new');

      this.platform.ready().then((ready) => {

        if (this.sessionUser === undefined) {
          this.nativeStorage.getItem("session").then(res => {
            this.sessionUser = res.user;
          }).catch(e => console.log(e));
        }

      });

    }

    updateNew(id: Number) {
      let newData = {
        "title": this.new.title,
        "description": this.new.description,
        "created_by": this.sessionUser.id,
        "image": (this.imageURI !== "") ? this.imageData : null,
      };
      this.loader.present();
      this.newProvider.updateNew(id, newData).then((observable: any) => {
        observable.subscribe((newResp: any) => {
          this.presentResponse(newResp);
          this.loader.dismiss();
          this.events.publish('new:reload-list');
          this.navCtrl.pop();
        });
      }).catch(() => {
        this.loader.dismiss();
      });
    }

    presentResponse(response) {
      let messages = "";
      for (let i = 0; i < response["messages"].length; i++) {
        messages += response["messages"][i] + "<br>";
        if (response["messages"].length > 1) messages += "<br>";
      }
      let alert = this.alertCtrl.create({
        title: response["header"],
        subTitle: messages,
        buttons: [
          {
            text: 'OK'
          }
        ]
      });
      alert.present();
    }

    getImage() {
        const options: CameraOptions = {
          quality: 60,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          sourceType: 0,
        };

        this.loader.present('Cargando imagen...');

        this.camera.getPicture(options).then((imageData) => {
          this.imageURI = "data:image/jpeg;base64," + imageData;
          this.imageData = imageData;
          this.new.image = this.imageURI;
          this.loader.dismiss();
        }, (error) => {
          console.log(error)
          this.loader.dismiss();
        });
      }
}
