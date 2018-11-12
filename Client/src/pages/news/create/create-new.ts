import {
    AlertController,
    IonicPage,
    NavController,
    NavParams,
    Events
} from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { Loader } from "../../../traits/Loader";
import { NativeStorage } from "@ionic-native/native-storage";
import { New } from "../../../models/new";
import { NewProvider } from '../../../providers/new/new';

@IonicPage()
@Component({
    selector: 'page-create-new',
    templateUrl: 'create-new.html',
})
export class CreateNewPage {

    new: New;
    imageURI: any;
    imageData: any;

    constructor(
      private camera: Camera,
      private loader: Loader,
      private newProvider: NewProvider,
      public alertCtrl: AlertController,
      public events: Events,
      public navCtrl: NavController,
      public navParams: NavParams,
      private nativeStorage: NativeStorage
    ) {
        this.new = navParams.get('new');
    }

    ionViewDidLoad() {
      console.log("create-new.ts");
    }

    updateNew(id: Number) {
      let self = this;
      let newData = {
        "title": this.new.title,
        "description": this.new.description,
        "created_by": this.nativeStorage.getItem("session")["__zone_symbol__value"].user.id,
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
      });
    }

    presentResponse(response) {
      let messages = "";
      for (let i = 0; i < response["messages"].length; i++) {
        messages += response["messages"][i] + "<br>";
        if (response["messages"].length > 1 && response["status"] == "error") messages += "<br>";
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
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          sourceType: 0,
        };

        this.camera.getPicture(options).then((imageData) => {
          this.imageURI = "data:image/jpeg;base64," + imageData;
          this.imageData = imageData;

        }, (error) => {
          console.log(error)
        });
      }
}
