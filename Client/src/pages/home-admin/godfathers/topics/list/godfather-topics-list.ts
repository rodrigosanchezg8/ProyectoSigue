import {Component} from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {GodfatherTopicsListPopoverPage} from "./popover/godfather-topics-list-popover";
import {ThreadProvider} from "../../../../../providers/thread/thread";
import {GodfatherTopicDetailPage} from "../detail/godfather-topic-detail";
import {Thread} from "../../../../../models/thread";
import {Loader} from "../../../../../traits/Loader";

@IonicPage()
@Component({
  selector: 'page-godfather-topic',
  templateUrl: 'godfather-topics-list.html',
})
export class GodfatherTopicsListPage {

  godfather: any;
  threads: Thread[];

  godfatherTopicDetailPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
              private threadProvider: ThreadProvider, public events: Events, public alertCtrl:  AlertController,
              private loaderCtrl: Loader) {
    this.threads = [];
    this.godfather = this.navParams.data;
    this.godfatherTopicDetailPage = GodfatherTopicDetailPage;
  }

  ionViewDidLoad() {
    this.subscribeCreateEvent();
    this.subscribeDeleteAllEvent();
    this.fillAllUserThreads();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(GodfatherTopicsListPopoverPage, this.godfather);
    popover.present({
      ev: event
    });
  }

  fillAllUserThreads() {
    this.loaderCtrl.present();
    this.threadProvider.getAllUserThreads(this.godfather.id).subscribe((data: Thread[]) => {
      for (let thread of data) {
        this.threads.push(new Thread().deserialize(thread));
      }});
    this.loaderCtrl.dismiss();
    console.log(this.threads);
  }

  subscribeCreateEvent() {
    this.events.subscribe('threads:create', (godfather, subject) => {

      let requestParams = {'subject': subject};

      this.loaderCtrl.present();
      this.threadProvider.storeUserThead(godfather.id, requestParams).subscribe((data: any) => {

        this.threads.splice(0, 0, new Thread().deserialize(data.thread));

        let pushParams = {thread: data.thread, subject: subject, godfather: godfather};
        this.navCtrl.push(GodfatherTopicDetailPage, pushParams);

        this.loaderCtrl.dismiss();

      });
    });
  }

  subscribeDeleteAllEvent() {
    this.events.subscribe('threads:delete-all', (godfather) => {
      this.loaderCtrl.present();
      this.threadProvider.deleteAllUserThreads(godfather.id).subscribe((data: any) => {
        this.threads = [];
        this.loaderCtrl.dismiss();
      });
    });
  }

  deleteThread(id:number){
    this.alertCtrl.create({
      title: '¡Atención!',
      subTitle: "¿Está seguro de eliminar el tema?",
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.loaderCtrl.present();
            this.threadProvider.deleteThread(id).subscribe(() => {
              let removeIndex = this.threads.findIndex((thread) => thread.id == id);
              if(removeIndex !== undefined)
                this.threads.splice(removeIndex, 1);
              this.loaderCtrl.dismiss();
            })
          }
        },
        {
          text: 'No',
        }
      ]
    }).present();
  }

}
