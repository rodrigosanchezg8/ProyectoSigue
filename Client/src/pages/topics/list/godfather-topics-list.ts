import {Component} from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  NavController,
  NavParams, Platform,
  PopoverController,
} from 'ionic-angular';
import {GodfatherTopicsListPopoverPage} from "./popover/godfather-topics-list-popover";
import {ThreadProvider} from "../../../providers/thread/thread";
import {GodfatherTopicDetailPage} from "../detail/godfather-topic-detail";
import {Thread} from "../../../models/thread";
import {Loader} from "../../../traits/Loader";
import {Observer, Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Godfather} from "../../../models/godfather";
import {NativeStorage} from "@ionic-native/native-storage";

@IonicPage()
@Component({
  selector: 'page-godfather-topics-list',
  templateUrl: 'godfather-topics-list.html',
})
export class GodfatherTopicsListPage {

  godfather: any;
  threads: Thread[];

  threadsSubscription: Subscription;
  threadsObserver: Observer<Thread[]>;

  sessionUser: Godfather;

  godfatherTopicDetailPage: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              private threadProvider: ThreadProvider,
              public events: Events,
              public alertCtrl: AlertController,
              private loaderCtrl: Loader,
              private platform: Platform,
              private nativeStorage: NativeStorage) {
    this.threads = [];
    this.godfather = this.navParams.get('godfather');
    this.godfatherTopicDetailPage = GodfatherTopicDetailPage;

    this.platform.ready().then((ready) => {
      if (this.sessionUser === undefined) {
        this.nativeStorage.getItem("session").then(res => {
          this.sessionUser = res.user;
        }).catch(e => console.log(e));
      }
    });

  }

  ionViewDidLoad() {
    this.constructThreadsObserver();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter GodfatherTopicsList');
    this.subscribeCreateEvent();
    this.subscribeDeleteAllEvent();
    if (this.threadsObserver !== undefined) {
      this.subscribeThreadsObserver();
      console.log('subscribed');
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave GodfatherTopicDetailPage');
    this.threadsSubscription.unsubscribe();
    this.events.unsubscribe('threads:delete-all');
    this.events.unsubscribe('threads:create');
  }

  subscribeCreateEvent() {
    this.events.subscribe('threads:create', (godfather, subject) => {

      let requestParams = {
        'subject': subject,
        'user_issuing_id': this.sessionUser.id,
        'user_receiver_id': this.sessionUser.id === 1 ? this.godfather.id : this.sessionUser.id
      };

      this.loaderCtrl.present();
      this.threadProvider.storeUserThead(requestParams).then((observable: any) => {
        observable.subscribe((data: any) => {

          this.threads.splice(0, 0, new Thread().deserialize(data.thread));

          let pushParams = {thread: data.thread, subject: subject, godfather: godfather};
          this.navCtrl.push(GodfatherTopicDetailPage, pushParams);

          this.loaderCtrl.dismiss();

        });
      });
    });
  }

  subscribeDeleteAllEvent() {
    this.events.subscribe('threads:delete-all', (godfather) => {
      this.loaderCtrl.present();
      this.threadProvider.deleteAllUserThreads(godfather.id).then((observable: any) => {
        observable.subscribe((data: any) => {
          this.threads = [];
          this.loaderCtrl.dismiss();
        });
      })
    });
  }

  constructThreadsObserver() {
    this.threadsObserver = {
      next: (response: Thread[]) => {

        console.log(response);

        for (let thread of response) {

          let pushed, updated;

          if (!this.threadInList(thread.id)) {
            this.threads.push(new Thread().deserialize(thread));
            pushed = true;
          }

          updated = this.updateThreads(thread);

          if (pushed || updated)
            this.sortThreads();
        }

      },
      error: (data) => {
        console.log(data);
      },
      complete: () => {
      }
    }
  }

  subscribeThreadsObserver() {
    this.threadsSubscription = TimerObservable.create(0, 10000).subscribe(() => {
      this.threadProvider.getAllUserThreads(this.godfather.id).then((observable: any) => {
        observable.subscribe(this.threadsObserver);
      });
    });
  }

  threadInList(id: number): boolean {
    return (this.threads === undefined || this.threads.length === 0) ? false : this.threads.find((thread) => {
      return thread.id === id
    }) !== undefined;
  }

  updateThreads(thread: Thread): boolean {
    let existingThread = this.threads.find((mThread) => {
      return mThread.id === thread.id
    });
    if (existingThread !== undefined) {

      if (existingThread.updated_at !== thread.updated_at)
        existingThread.updated_at = thread.updated_at;
      if (existingThread.last_message !== thread.last_message)
        existingThread.last_message = thread.last_message;

      return true;
    }
    return false;
  }

  sortThreads() {
    this.threads.sort((aThread, bThread) => {
      if (aThread.updated_at > bThread.updated_at)
        return -1;
      if (aThread.updated_at < bThread.updated_at)
        return 1;
      return 0;
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodfatherTopicsListPopoverPage, this.godfather);
    popover.present({
      ev: event
    });
  }

  deleteThread(id: number) {
    this.alertCtrl.create({
      title: '¡Atención!',
      subTitle: "¿Está seguro de eliminar el tema?",
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.loaderCtrl.present();
            this.threadProvider.deleteThread(id).then((observable: any) => {
              observable.subscribe(() => {
                let removeIndex = this.threads.findIndex((thread) => thread.id == id);
                if (removeIndex !== undefined)
                  this.threads.splice(removeIndex, 1);
                this.loaderCtrl.dismiss();
              })
            });
          }
        },
        {
          text: 'No',
        }
      ]
    }).present();
  }

  hasNotification(thread: Thread){
    return thread.notification !== null &&  thread.notification !== undefined && thread.notification.user_id === this.sessionUser.id;
  }

}
