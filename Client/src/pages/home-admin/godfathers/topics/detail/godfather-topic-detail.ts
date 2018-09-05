import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ThreadProvider} from "../../../../../providers/thread/thread";
import {Thread} from "../../../../../models/thread";
import {Message} from "../../../../../models/message";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Observer, Subscription} from "rxjs";
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
  messagesObserver: Observer<Message[]>;

  fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage, private loader: Loader, private camera: Camera,
              private formBuilderCtrl: FormBuilder, private transfer: FileTransfer, private file: File,
              private fileChooser: FileChooser, private filePath: FilePath, private base64: Base64,
              private fileProvider: FileProvider) {
    this.thread = this.navParams.data.thread;
    this.thread.messages = [];
    this.fileTransfer = this.transfer.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodfatherTopicDetailPage');

    if(this.sessionUser === undefined){
      this.nativeStorage.getItem("session").then(res => {
        this.sessionUser = res.user;
        console.log(res);
      }).catch(e => console.log(e));

    }

    this.messagesObserver = {
      next: (response: Message[]) => {
        for (let message of response) {
          if (this.lastMessageId() < message.id) {
            let newMessage = new Message().deserialize(message).setClass(this.sessionUser.id);
            this.thread.messages.push(newMessage);
          }
        }
      },
      error: (err: any) => { console.log(err) },
      complete: () => {}
    };

  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter GodfatherTopicDetailPage');
    if(this.messagesObserver !== undefined)
      this.subscribeMessageListening();
  }

  ionViewDidLeave(){
    console.log('ionViewDidLeave GodfatherTopicDetailPage');
    this.messagesSubscription.unsubscribe();
  }

  subscribeMessageListening() {
    this.messagesSubscription = TimerObservable.create(0, 2500).subscribe(() => {
      this.threadProvider.getThreadMessages(this.thread.id, this.lastMessageId()).subscribe(this.messagesObserver);
    });
  }

  lastMessageId(): Number {
    return (this.thread.messages === undefined || this.thread.messages.length === 0) ? 0 : this.thread.messages[this.thread.messages.length - 1].id;
  }

  sendMessage() {

      this.loader.present();
      this.threadProvider.storeThreadMessage(
        this.sessionUser.id, this.thread.id, {'body': this.bodyMessage}
      ).subscribe((response) => {
        console.log(response);
        this.loader.dismiss();
      }, () => {

      }, () => {
      });
      this.bodyMessage = ""

  }

  attachFile(){
    this.fileChooser.open()
      .then(uri => {

        this.loader.present();
        this.filePath.resolveNativePath(uri)
          .then(file => {

            let filePath: string = file;
            if (filePath) {
              this.base64.encodeFile(filePath).then((base64File: string) => {

                  this.fileProvider.uploadFile('threads',this.thread.id, { file: base64File })
                    .subscribe(response => {
                      this.loader.dismiss();
                  }, error => {
                      this.loader.dismiss();
                  }, () => {
                      this.loader.dismiss();
                    });

                }, (err) => {
                  alert('err'+JSON.stringify(err));
                });
            }
          })
          .catch(err => console.log(err));
      });
  }

}
