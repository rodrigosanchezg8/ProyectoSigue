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
  bodyMessage: string;

  sessionUser: Godfather;

  messagesSubscription: Subscription;

  fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage, private loader: Loader, private camera: Camera,
              private formBuilderCtrl: FormBuilder, private transfer: FileTransfer, private file: File,
              private fileChooser: FileChooser, private filePath: FilePath, private base64: Base64,
              private fileProvider: FileProvider, public popoverCtrl: PopoverController, public events: Events,
              private menuCtrl: MenuController, private socket: Socket) {
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

    this.socket.emit('')

    this.subscribePopoverEvents();
    this.subscribeMessages();
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

  subscribeMessages() {
    this.messagesSubscription = this.getMessages().subscribe((message: Message) => {
      console.log(message);
      let newMessage = new Message().deserialize(message).setClass(this.sessionUser.id);
      this.thread.messages.push(newMessage);
    });
  }

  sendMessage() {
    this.loader.present();
    this.threadProvider.storeThreadMessage(this.sessionUser.id, this.thread.id, {'body': this.bodyMessage})
      .then((observable: any) => {
        observable.subscribe((response) => {
          console.log(response);
          this.loader.dismiss();
        });
      });
    this.bodyMessage = ""
  }

  attachFile() {
    this.fileChooser.open().then(uri => {
      this.loader.present();
      this.filePath.resolveNativePath(uri)
        .then(file => {

          let filePath: string = file;
          if (filePath) {
            this.base64.encodeFile(filePath).then((base64File: string) => {

              this.fileProvider.uploadFile('threads', this.thread.id, {file: base64File}).then((observable: any) => {
                observable.subscribe(response => {
                  this.loader.dismiss();
                }, error => {
                  this.loader.dismiss();
                });
              })
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
    this.menuCtrl.open('right');
  }

  toggleMenu() {
    this.menuCtrl.toggle('right');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

}
