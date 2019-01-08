import { AlertController, Events, IonicPage, NavController, NavParams, Platform, PopoverController }
from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Godfather } from "../../../models/godfather";
import { Loader } from "../../../traits/Loader";
import { NativeStorage } from "@ionic-native/native-storage";
import { New } from "../../../models/new";
import { NewProvider } from "../../../providers/new/new";
import { NewsDetailPage } from "../detail/news-detail";
import { NewsListPopoverPage } from "./news-list-popover/news-list-popover";

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
  limit: number = 5;
  topList: number = 0;

  constructor(
    private camera: Camera,
    private formBuilderCtrl: FormBuilder,
    private loader: Loader,
    private nativeStorage: NativeStorage,
    private newsProvider: NewProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    ) {
      this.createForm();
      this.newsDetailPage = NewsDetailPage;

    this.platform.ready().then((ready) => {

      if (this.sessionUser === undefined) {
        this.nativeStorage.getItem("session").then(res => {
          this.sessionUser = res.user !== undefined ? res.user : null;
          this.fillNews();
        }, error => {
          this.fillNews();
        }).catch(e => console.log(e));
      }
      else {
        this.fillNews();
      }

    });

    this.events.subscribe('new:reload-list', () => {
        this.fillNews();
      });

  }

  fillNews(){
    this.loader.present('Obteniendo noticias...');
    this.newsProvider.getNews().then((observable: any) => {

          observable.subscribe((data: New[]) => {
            this.news = data;
            this.loader.dismiss();
          }, () => this.loader.dismiss());

    }).catch(e => this.loader.dismiss());
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
      "created_by": this.sessionUser.id,
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
    }).catch(() => this.loader.dismiss() );
  }

  getImage() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: 0,
    };

    this.loader.present('Cargando imagen');

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = "data:image/jpeg;base64," + imageData;
      this.imageData = imageData;

      this.form.get('new_image').setValue({
        filename: "new_image",
        filetype: "jpeg",
        value: imageData
      });

      this.loader.dismiss();

    }, (err) => this.loader.dismiss() );
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
