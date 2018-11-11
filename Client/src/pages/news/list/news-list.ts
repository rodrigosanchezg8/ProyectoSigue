import { AlertController, IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Godfather } from "../../../models/godfather";
import { GodfatherProvider } from "../../../providers/godfather/godfather";
import { Loader } from "../../../traits/Loader";
import { NativeStorage } from "@ionic-native/native-storage";
import { New } from "../../../models/new";
import { NewProvider } from "../../../providers/new/new";
import { NewsListPopoverPage } from "./news-list-popover/news-list-popover";
import { NewsDetailPage } from "../detail/news-detail";

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news-list.html',
})
export class NewsListPage {

  title: string = "";
  description: string = "";
  new_image: string = "";
  imageURI: any;
  imageData: any;
  form: FormGroup;

  news: New[] = [];

  sessionUser: Godfather;
  newsDetailPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
              private newsProvider: NewProvider, private nativeStorage: NativeStorage, private toastCtrl: ToastController,
              private formBuilderCtrl: FormBuilder, private camera: Camera, public alertCtrl: AlertController,
              private loader: Loader, private loaderCtrl: Loader) {
    this.createForm();
    this.newsDetailPage = NewsDetailPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsListPage');

    if (this.sessionUser === undefined) {
      this.nativeStorage.getItem("session").then(res => {
        this.sessionUser = res.user !== undefined ? res.user : null;
        console.log(this.sessionUser);
      }).catch(e => console.log(e));
    }

    this.fillNews();
  }

  ionViewWillEnter() {
    this.fillNews();
  }

  fillNews(){
    this.newsProvider.getNews().then((observable: any) => {
      observable.subscribe((data: New[]) => {
        console.log(data);
        this.news = data;
      });
    }).catch(e => console.log(e));
  }

  createForm() {
    this.form = this.formBuilderCtrl.group({
      new_image: null
    });
  }

  registerNew() {
    let self = this;
    let newData = {
      "title": this.title,
      "description": this.description,
      "created_by": this.nativeStorage.getItem("session")["__zone_symbol__value"].user.id,
      "image": (this.imageURI !== "") ? self.form.value : null,
    };
    this.loader.present();
    this.newsProvider.registerNew(newData).then((observable: any) => {
      observable.subscribe((newResp: any) => {
        this.presentResponse(newResp);
        this.loader.dismiss();
        self.fillNews();
        self.clearRegisterNewForm();
      });
    });
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

      this.form.get('new_image').setValue({
        filename: "new_image",
        filetype: "jpeg",
        value: imageData
      });

    }, (err) => {
      this.presentToast(err);
    });
  }

  presentResponse(response) {
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
          text: 'OK'
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

  presentPopover(event) {
    let popover = this.popoverCtrl.create(NewsListPopoverPage);
    popover.present({
      ev: event
    });
  }

  clearRegisterNewForm() {
    this.title = "";
    this.description =  "";
    this.new_image = "";
    this.imageURI = "";
    this.imageData = "";
  }

}
