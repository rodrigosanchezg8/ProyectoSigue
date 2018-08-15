import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ThreadProvider} from "../../../../../providers/thread/thread";
import {Thread} from "../../../../../models/thread";
import {Message} from "../../../../../models/message";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Observer, Subscription} from "rxjs";
import {Godfather} from "../../../../../models/godfather";
import {HttpHeaders} from "@angular/common/http";
import {NativeStorage} from "@ionic-native/native-storage";
import {Loader} from "../../../../../traits/Loader";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private threadProvider: ThreadProvider,
              private nativeStorage: NativeStorage, private loader: Loader) {
    this.thread = this.navParams.data.thread;
    this.thread.messages = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GodfatherTopicDetailPage');
    this.messagesObserver = {
      next: (response: Message[]) => {
        for (let message of response) {
          if (this.lastMessageId() < message.id)
            this.thread.messages.push(new Message().deserialize(message));
        }
      },
      error: (err: any) => { console.log(err) },
      complete: () => {}
    };
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter GodfatherTopicDetailPage');
    if(this.messagesObserver !== undefined && this.messagesSubscription === undefined)
      this.subscribeMessageListening();
  }

  ionViewDidLeave(){
    console.log('ionViewDidLeave GodfatherTopicDetailPage');
    this.messagesSubscription.unsubscribe();
  }

  subscribeMessageListening() {
    this.messagesSubscription = TimerObservable.create(0, 5000).subscribe(() => {
      this.threadProvider.getThreadMessages(this.thread.id, this.lastMessageId()).subscribe(this.messagesObserver);
    });
  }

  lastMessageId(): Number {
    return (this.thread.messages === undefined || this.thread.messages.length === 0) ? 0 : this.thread.messages[this.thread.messages.length - 1].id;
  }

  sendMessage() {

    this.loader.present();
    if(this.sessionUser === undefined){

      this.nativeStorage.getItem("session").then(res => {
       this.sessionUser = res.user;
       this.loader.dismiss();
       this.sendMessage();
      }).catch(e => console.log(e));

    }
    else {

      this.loader.present();
      this.threadProvider.storeThreadMessage(
        this.sessionUser.id, this.thread.id, {'body': this.bodyMessage}
      ).subscribe((response) => {
        console.log(response);
      }, () => {

      }, () => {
        this.loader.dismiss();
      });
      this.bodyMessage = ""

    }

  }

}
