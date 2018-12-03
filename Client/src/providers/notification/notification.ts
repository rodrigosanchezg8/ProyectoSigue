import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Singleton} from "../singleton/singleton";

@Injectable()
export class NotificationProvider {

  BASE_URL = "notifications";

  constructor(public http: HttpClient, public singletonService: Singleton) {}

  deleteNotification(threadID, userID){
    let deleteURL = this.BASE_URL;
    let data = {
      thread_id : threadID,
      user_id: userID
    };
    return this.singletonService.put(deleteURL,data, true);
  }



}
