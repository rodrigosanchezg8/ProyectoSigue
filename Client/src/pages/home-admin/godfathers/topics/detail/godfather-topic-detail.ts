import {Component} from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  MenuController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {ThreadProvider} from "../../../../../providers/thread/thread";
import {Thread} from "../../../../../models/thread";
import {Message} from "../../../../../models/message";
import {Observable, Subscription} from "rxjs";
import {Godfather} from "../../../../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";
import {Loader} from "../../../../../traits/Loader";
import {Camera} from "@ionic-native/camera";
import {FormBuilder} from "@angular/forms";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file';
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {Base64} from "@ionic-native/base64";
import {FileProvider} from "../../../../../providers/file/file";
import {TopicsDetailPopoverPage} from "./popover/topics-detail-popover";
import {Socket} from "ng-socket-io";
import {HttpClient} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-godfather-topic-detail',
  templateUrl: 'godfather-topic-detail.html',
})
export class GodfatherTopicDetailPage {

  thread: Thread;
  message: Message;
  files: any = [];

  sessionUser: Godfather;

  messagesSubscription: Subscription;

  fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage, private loader: Loader, private camera: Camera,
              private formBuilderCtrl: FormBuilder, private transfer: FileTransfer, private file: File,
              private fileChooser: FileChooser, private filePath: FilePath, private base64: Base64,
              private fileProvider: FileProvider, public popoverCtrl: PopoverController, public events: Events,
              private menuCtrl: MenuController, private socket: Socket, private httpClient: HttpClient,
              private alertCtrl: AlertController) {
    this.message = new Message();
    this.thread = this.navParams.data.thread;
    this.thread.messages = [];
    this.fileTransfer = this.transfer.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodfatherTopicDetailPage');
    if (this.sessionUser === undefined) {
      this.nativeStorage.getItem("session").then(res => {
        this.sessionUser = res.user;
      }).catch(e => console.log(e));
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter GodfatherTopicDetailPage');

    //this.socket.on('connect', () => { alert('connected')});
    this.subscribePopoverEvents();

    this.requestHistoryEvent();
    this.subscribeSocketMessages();
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave GodfatherTopicDetailPage');
    this.messagesSubscription.unsubscribe();
    this.events.unsubscribe('thread-files:list');
  }

  subscribePopoverEvents() {
    this.events.subscribe('thread-files:list', () => {
      this.openMenu();
      this.toggleMenu();
    })
  }

  getMessages() {
    return new Observable(observer => {
      this.socket.on('private-thread:' + this.thread.id, (data) => {
        observer.next(data);
      });
    });
  }

  requestHistoryEvent() {
    this.loader.present();
    this.threadProvider.getThreadMessages(this.thread.id, 0).then((observable: any) => {
      observable.subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      }, () => {
        this.loader.dismiss();
      });
    });
  }

  subscribeSocketMessages() {
    this.messagesSubscription = this.getMessages().subscribe((socketMessagesData: any) => {
      console.log(socketMessagesData);
      switch (socketMessagesData.event) {
        case 'App\\Events\\ThreadHistoryRequested':
          if(this.thread.messages.length == 0) {
            for (let message of socketMessagesData.data.thread.messages) {
              let newMessage = new Message().deserialize(message).setClass(this.sessionUser.id);
              this.thread.messages.push(newMessage);
            }
          }
          this.loader.dismiss();
          break;
        case 'App\\Events\\NewThreadMessage':
          let newMessage = new Message().deserialize(socketMessagesData.data.message).setClass(this.sessionUser.id);
          this.thread.messages.push(newMessage);
      }
    });
  }

  sendMessage() {
    this.loader.present();
    this.threadProvider.storeThreadMessage(this.sessionUser.id, this.thread.id, this.message)
      .then((observable: any) => {
        this.loader.dismiss();
        this.message = new Message();
        observable.subscribe((response) => {
          console.log(response);
        });
      });
  }

  attachMessageFile() {
    this.fileChooser.open().then(uri => {

      this.loader.present();
      this.filePath.resolveNativePath(uri).then(file => {

        let filePath: string = file;
        if (filePath) {

          this.message.file_extension = filePath.substr(filePath.lastIndexOf('/') + 1);
          this.message.file_name = this.message.file_extension.substr(this.message.file_extension.lastIndexOf('.') + 1);

          this.base64.encodeFile(filePath).then((base64File: string) => {

            this.message.base64_file = base64File;

          }, (err) => {
            alert('err' + JSON.stringify(err));
          });
        }

      })
        .catch(err => console.log(err));
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(TopicsDetailPopoverPage);
    popover.present({
      ev: event
    });
  }

  openMenu() {
    this.menuCtrl.open('right').then((opened) => {
      this.threadProvider.getThreadFiles(this.thread.id).then((observable: any) => {
        observable.subscribe((data: any) => {
          this.files = data;
        });
      })
    });
  }

  // TODO Regresar el get del httpclient desde un provider
  downloadFile(file) {
    let encodedURI = encodeURI(this.threadProvider.API + "files/" + file.id + "/download");
    this.loader.present("Descargando archivo...");

    let alertTitle = "", alertSubtitle = "";
    this.httpClient.get(encodedURI, {responseType: 'blob'})
      .flatMap((data: Blob) => {
        return Observable.from(this.file.writeFile(this.file.externalRootDirectory + "/Download", file.name,
          data, { replace: true }))
      }).subscribe(response => {
        alertTitle = "Éxito";
        alertSubtitle = "El archivo lo puedes encontrar en tu carpeta de descargas. Su nombre es " + file.name;
      }, err => {
        alertTitle = "Ooops!";
        alertSubtitle = "Ha habido un problema con éste archivo, es posible que no exista o que no " +
          "tengas espacio de almacenamiento";
      },
      () => {
        this.loader.dismiss();
        this.alertCtrl.create({
          title: alertTitle,
          subTitle: alertSubtitle,
          buttons: [
            {text: "Ok"}
          ]
        }).present();
      });
}

toggleMenu()
{
  this.menuCtrl.toggle('right');
}

}
