import {Component} from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ThreadProvider} from "../../../../../providers/thread/thread";
import {Thread} from "../../../../../models/thread";
import {Message} from "../../../../../models/message";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Observable, Observer, Subscription} from "rxjs";
import {Godfather} from "../../../../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";
import {Loader} from "../../../../../traits/Loader";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file';
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {Base64} from "@ionic-native/base64";
import {FileProvider} from "../../../../../providers/file/file";
import {TopicsDetailPopoverPage} from "./popover/topics-detail-popover";
import {Socket} from "ng-socket-io";

@IonicPage()
@Component({
  selector: 'page-godfather-topic-detail',
  templateUrl: 'godfather-topic-detail.html',
})
export class GodfatherTopicDetailPage {

  thread: Thread;
  message: Message;
  files: [] = [];

  sessionUser: Godfather;

  messagesSubscription: Subscription;

  fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage, private loader: Loader, private camera: Camera,
              private formBuilderCtrl: FormBuilder, private transfer: FileTransfer, private file: File,
              private fileChooser: FileChooser, private filePath: FilePath, private base64: Base64,
              private fileProvider: FileProvider, public popoverCtrl: PopoverController, public events: Events,
              private menuCtrl: MenuController, private socket: Socket) {
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

  requestHistoryEvent(){
    this.loader.present();
    this.threadProvider.getThreadMessages(this.thread.id, 0).then((observable: any) => {
      observable.subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    });
  }

  subscribeSocketMessages() {
    this.messagesSubscription = this.getMessages().subscribe((socketMessagesData: any) => {
      switch (socketMessagesData.event) {
        case 'App\\Events\\ThreadHistoryRequested':
          for (let message of socketMessagesData.data.thread.messages) {
            let newMessage = new Message().deserialize(message).setClass(this.sessionUser.id);
            this.thread.messages.push(newMessage);
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
        observable.subscribe((response) => {
          console.log(response);
          this.loader.dismiss();
        });
      });
    this.message = new Message();
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

  toggleMenu() {
    this.menuCtrl.toggle('right');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

}
