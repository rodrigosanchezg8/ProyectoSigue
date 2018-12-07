import {Component, ViewChild} from '@angular/core';
import {
  AlertController, App, Content,
  Events,
  IonicPage,
  MenuController,
  NavController,
  NavParams, Platform,
  PopoverController,
} from 'ionic-angular';
import {ThreadProvider} from "../../../providers/thread/thread";
import {Thread} from "../../../models/thread";
import {Message} from "../../../models/message";
import {Observable, Subscription} from "rxjs";
import {Godfather} from "../../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";
import {Loader} from "../../../traits/Loader";
import {Camera} from "@ionic-native/camera";
import {FormBuilder} from "@angular/forms";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file';
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {Base64} from "@ionic-native/base64";
import {FileProvider} from "../../../providers/file/file";
import {TopicsDetailPopoverPage} from "./popover/topics-detail-popover";
import {Socket} from "ng-socket-io";
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import {NotificationProvider} from "../../../providers/notification/notification";
import {Route} from "@angular/compiler/src/core";

@IonicPage()
@Component({
  selector: 'page-godfather-topic-detail',
  templateUrl: 'godfather-topic-detail.html',
})
export class GodfatherTopicDetailPage {

  @ViewChild(Content) content: Content;

  active: boolean;
  thread: Thread;
  message: Message;
  files: any = [];
  sessionUser: Godfather;
  messagesSubscription: Subscription;
  fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage,
              private loader: Loader,
              private camera: Camera,
              private formBuilderCtrl: FormBuilder,
              private transfer: FileTransfer,
              private file: File,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private base64: Base64,
              private fileProvider: FileProvider,
              public popoverCtrl: PopoverController,
              public events: Events,
              private menuCtrl: MenuController,
              private socket: Socket,
              private httpClient: HttpClient,
              private alertCtrl: AlertController,
              private platform: Platform,
              private notificationProvider: NotificationProvider) {
    this.thread = this.navParams.data.thread;
    this.thread.messages = [];
    this.fileTransfer = this.transfer.create();
    this.platform.ready().then((ready) => {

      if (this.sessionUser === undefined) {
        this.nativeStorage.getItem("session").then(res => {
          this.sessionUser = res.user;
        }).catch(e => console.log(e));
      }

    });

  }

  ngOnInit() {
    this.message = new Message();
  }

  ionViewDidEnter() {
    //this.socket.on('connect', () => { alert('connected')});
    this.subscribePopoverEvents();

    this.requestHistoryEvent();
    this.subscribeSocketMessages();
  }

  ionViewDidLeave() {
    this.messagesSubscription.unsubscribe();
    this.events.unsubscribe('thread-files:list');
  }

  ionViewWillEnter() {

    this.active = true;

    this.platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        this.active = false;
      });

      this.platform.resume.subscribe(() => {
        this.active = true;
        this.providerNotificationDelete();
      });
    });
  }

  ionViewWillLeave() {
    this.active = false;
  }

  subscribePopoverEvents() {
    this.events.subscribe('thread-files:list', () => {
      this.openMenu();
      this.toggleMenu();
    })
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(TopicsDetailPopoverPage);
    popover.present({
      ev: event
    });
  }

  getMessages() {
    return new Observable(observer => {
      this.socket.on('private-thread:' + this.thread.id, (data) => {
        observer.next(data);
      });
    });
  }

  requestHistoryEvent() {
    //this.loader.present();
    this.threadProvider.getThreadMessages(this.thread.id, 0).then((observable: any) => {
      observable.subscribe((response) => {
        console.log(response);
      }, (error) => {
        alert('No se pudieron obtener los mensajes de este tema, contacte al equipo de desarrollo')
      });
    });
  }

  // TODO Notify the other user when a file is sent
  subscribeSocketMessages() {
    this.messagesSubscription = this.getMessages().subscribe((socketMessagesData: any) => {
      this.loader.present();
      switch (socketMessagesData.event) {
        case 'App\\Events\\ThreadHistoryRequested':
          if (this.thread.messages.length == 0) {
            for (let message of socketMessagesData.data.thread.messages) {
              let newMessage = new Message().deserialize(message).setClass(this.sessionUser.id);
              this.thread.messages.push(newMessage);
            }
          }
          this.loader.dismiss();
          setTimeout(() => this.content.scrollToBottom(), 300);
          break;
        case 'App\\Events\\NewThreadMessage':
          let newMessage = new Message().deserialize(socketMessagesData.data.message).setClass(this.sessionUser.id);
          this.thread.messages.push(newMessage);
          this.loader.dismiss();
          setTimeout(() => this.content.scrollToBottom(), 300);
        case 'App\\Events\\NewFile':
          break;
      }
      this.providerNotificationDelete();
    },
      () => {
        this.loader.dismiss();
        alert('Error al obtener los mensajes. Comuníquese con el equipo desarrollador.');
      });
  }

  sendMessage() {

    this.message.user_id_receiver = this.thread.user_id_issuing === this.sessionUser.id ?
      this.thread.user_id_receiver : this.thread.user_id_issuing;

    this.threadProvider.storeThreadMessage(this.sessionUser.id, this.thread.id, this.message)
      .then((observable: any) => {
        observable.subscribe((response) => {

          this.message.body = "";
          this.message.file_name = null;
          this.message.base64_file = null;

          this.content.resize();

          this.content.scrollToBottom();

        });
      }).catch(e => {
      alert("Error al enviar mensaje. Contacte al equipo de desarrollo");
    });
  }

  attachMessageFile() {
    this.fileChooser.open().then(uri => {

      this.loader.present();
      this.filePath.resolveNativePath(uri).then(file => {

        let filePath: string = file;
        if (filePath) {

          this.message.file_name = filePath.substr(filePath.lastIndexOf('/') + 1);

          this.base64.encodeFile(filePath).then((base64File: string) => {

            this.message.base64_file = base64File;
            this.content.resize();
            this.loader.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Listo',
              subTitle: 'Envíe el mensaje para enviar el archivo.',
              buttons: [
                {
                  text: 'OK',
                }
              ]
            });
            alert.present();

          }, (err) => {
            alert('Error al subir el archivo, asegúrese de que es un archivo válido y comuníquese con el equipo desarrollador.');
            this.loader.dismiss();
          });
        }

      }).catch(err => {
        alert('Error al subir el archivo, asegúrese de que es un archivo válido y comuníquese con el equipo desarrollador.');
        this.loader.dismiss();
      });
    });
  }

  // TODO Simplicar código y regresar el get del httpclient desde un provider
  downloadFile(file) {
    let encodedURI = encodeURI(this.threadProvider.API + "files/" + file.id + "/download");
    this.loader.present("Descargando archivo...");

    let alertTitle = "", alertSubtitle = "";
    this.httpClient.get(encodedURI, {responseType: 'blob'}).flatMap((data: Blob) => {
      return Observable.from(this.file.writeFile(this.file.externalRootDirectory + "/Download", file.name,
        data, {replace: true}))
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

  openMenu() {
    this.menuCtrl.open('right').then((opened) => {
      this.threadProvider.getThreadFiles(this.thread.id).then((observable: any) => {
        observable.subscribe((data: any) => {
          this.files = data;
        });
      })
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle('right');
  }

  providerNotificationDelete() {

    if(this.active) {

      this.notificationProvider.deleteNotification(this.thread.id, this.sessionUser.id).then((observable: any) => {
        observable.subscribe(res => {
          this.thread.notification = null;
        });
      }).catch((error) => {
        console.log(error);
      });
    }


  }

}
