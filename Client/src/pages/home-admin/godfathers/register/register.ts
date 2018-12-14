import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  AlertController, Events,
  IonicPage, NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GodfatherProvider} from "../../../../providers/godfather/godfather";
import {Loader} from "../../../../traits/Loader";
import {Godfather} from "../../../../models/godfather";
import {Base64} from "@ionic-native/base64";

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
              private loaderCtrl: Loader,
              private eventsCtrl: Events,
              private base64: Base64) {
    this.godfather = navParams.get('godfather');
    if (this.godfather) {
      this.isEditMode = true;
      this.godfather.password = null;
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
    this.imageURI = this.godfatherProvider.singletonService.API + "storage/assets/children.png";
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
        resolve(this.godfatherProvider.putGodfather(this.godfather));
      }
      else {
        resolve(this.godfatherProvider.postGodfather(this.godfather));
      }
    }).then((observable: any) => {
      observable.subscribe((res: any) => {
        this.loaderCtrl.dismiss();
        switch (res.status) {
          case "success":
            this.imageURI === undefined ? this.presentResponse(res) : this.sendProfileImage(res);
            break;
          case "error":
          default:
            this.presentResponse(res);
        }
      });
    });
  }


  sendProfileImage(res: any) {
    if (this.imageURI !== undefined) {
      this.loaderCtrl.present();
      console.log(res);
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
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: 0,
    };

    this.loaderCtrl.present('Cargando imagen...');
    this.camera.getPicture(options).then((imageData) => {

        this.imageURI = "data:image/jpeg;base64," + imageData;
        this.imageData = imageData;

        this.form.get('profile_image').setValue({
          filename: "profile_image",
          filetype: "jpeg",
          value: imageData
        });

        this.loaderCtrl.dismiss();

    }, (err) => {
      this.loaderCtrl.dismiss();
    });
  }

  presentResponse(response) {
    let alert = this.alertCtrl.create({
      title: response["header"],
      subTitle: this.parseResponseMessages(response),
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (response["status"] == "success") {
              alert.dismiss().then(() => {

                if(this.isEditMode)
                  this.publishUpdatedEvent();

                this.navCtrl.pop();

              });
            } else {
              alert.dismiss();
            }
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  parseResponseMessages(response){
    let messages = "";
    for (let i = 0; i < response["messages"].length; i++) {
      messages += response["messages"][i];
      if (response["messages"].length > 1) messages += "<br\>";
    }
    return messages;
  }

  publishUpdatedEvent(){
    this.eventsCtrl.publish('godfather:updated', this.godfather.id);
  }

}
