import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage, NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GodfatherProvider} from "../../../../providers/godfather/godfather";
import {Loader} from "../../../../traits/Loader";
import {Godfather} from "../../../../models/godfather";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  godfather: Godfather;
  imageURI: any;
  imageData: any;
  form: FormGroup;
  assets: string[] = [];
  isEditMode: boolean;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(public navParams: NavParams,
              private camera: Camera,
              public toastCtrl: ToastController,
              private godfatherProvider: GodfatherProvider,
              private formBuilderCtrl: FormBuilder,
              public alertCtrl: AlertController,
              public navCtrl: NavController,
              private loaderCtrl: Loader) {
    this.godfather = navParams.get('godfather');
    if (this.godfather) {
      this.isEditMode = true;
    }
    else {
      this.godfather = new Godfather();
      this.isEditMode = false;
    }
  }

  ionViewWillEnter() {
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.assets['children'] = this.godfatherProvider.singletonService.API + "storage/assets/children.png";
  }

  createForm() {
    this.form = this.formBuilderCtrl.group({
      profile_image: null
    });
  }

  sendRequest() {
    new Promise((resolve, reject) => {
      this.loaderCtrl.present();
      if(this.isEditMode){
        console.log('updategodfather');
        resolve(this.godfatherProvider.putGodfather(this.godfather));
      }
      else {
        console.log('addgodfather');
        resolve(this.godfatherProvider.postGodfather(this.godfather));
      }
    }).then((observable: any) => {
      observable.subscribe((res: any) => {
        this.loaderCtrl.dismiss();
        switch (res.status) {
          case "success":
            this.imageURI === "" ? this.presentResponse(res) : this.sendProfileImage(res);
            break;
          case "error":
          default:
            this.presentResponse(res);
        }
      });
    });
  }


  sendProfileImage(res: any) {
    if (this.imageURI !== "") {
      this.loaderCtrl.present();
      this.godfatherProvider.uploadProfileImage(this.form.value, res.data.id).then((observable: any) => {
        observable.subscribe((profileImgRes: any) => {
          this.loaderCtrl.dismiss();
          this.presentResponse(res);
        });
      }).catch(e => {
        this.loaderCtrl.dismiss();
      });
    }
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

      this.form.get('profile_image').setValue({
        filename: "profile_image",
        filetype: "jpeg",
        value: imageData
      });

    }, (err) => {
      this.presentToast(err);
    });
  }

  presentResponse(response) {
    let self = this;
    let messages = "";
    for (let i = 0; i < response["messages"].length; i++) {
      messages += response["messages"][i];
      if (response["messages"].length > 1 && response["status"] == "error") messages += "<br>";
    }
    let alert = this.alertCtrl.create({
      title: response["header"],
      subTitle: messages,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (response["status"] == "success") self.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
