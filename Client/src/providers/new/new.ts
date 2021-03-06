import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Singleton } from "../singleton/singleton";

/*
  Generated class for the NewProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NewProvider {

  GET_NEWS: string;
  POST_NEWS: string;
  DELETE_NEW: string;
  PUT_NEWS: string;

  constructor(public http: HttpClient, private singletonService: Singleton) {
    console.log('Hello NewProvider Provider');
    this.GET_NEWS = "events";
    this.POST_NEWS = "events";
  }

  registerNew(eventData){
    return this.singletonService.post(this.POST_NEWS, eventData);
  }

  updateNew(id: Number, eventData) {
    this.PUT_NEWS = "events/" + id;
    return this.singletonService.put(this.PUT_NEWS, eventData);
  }

  getNews(){
    return this.singletonService.get(this.GET_NEWS, false);
  }

  deleteNew(id: Number) {
    this.DELETE_NEW = "events/" + id;
    return this.singletonService.delete(this.DELETE_NEW);
  }

}
