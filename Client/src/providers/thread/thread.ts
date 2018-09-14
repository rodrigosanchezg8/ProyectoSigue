import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Singleton} from "../singleton/singleton";

@Injectable()
export class ThreadProvider {
  private GET_ALL_USER_THREADS: string;
  private STORE_USER_THREAD: string;
  private STORE_THREAD_MESSAGE : string;
  private GET_THREAD_MESSAGES : string;
  private DELETE_ALL_USER_THREADS: string;
  private DELETE_THREAD: string;
  private GET_THREAD_FILES: string;

  constructor(public http: HttpClient, private singletonService: Singleton) {
    console.log('Hello GodfatherProvider Provider');
  }

  storeUserThead(receiverId: Number, data: any){
    this.STORE_USER_THREAD = "threads/messages/" + receiverId;
    return this.singletonService.post(this.STORE_USER_THREAD, data);
  }

  getAllUserThreads(id: Number) {
    this.GET_ALL_USER_THREADS = "threads/" + id;
    return this.singletonService.get(this.GET_ALL_USER_THREADS);
  }

  deleteThread(id: Number){
    this.DELETE_THREAD = "threads/" + id;
    return this.singletonService.delete(this.DELETE_THREAD);
  }
  
  deleteAllUserThreads(id: Number){
    this.DELETE_ALL_USER_THREADS = "threads/" + id + "/delete-all";
    return this.singletonService.delete(this.DELETE_ALL_USER_THREADS);
  }

  storeThreadMessage(receiverId: Number, threadId: Number, data: object){
    this.STORE_THREAD_MESSAGE = "message/" + threadId + "/user/" + receiverId;
    return this.singletonService.post(this.STORE_THREAD_MESSAGE, data);
  }

  getThreadMessages(threadId: Number, startMessageId: Number) {
    this.GET_THREAD_MESSAGES = "threads/" + threadId + "/messages/" + startMessageId;
    return this.singletonService.get(this.GET_THREAD_MESSAGES);
  }

  getThreadFiles(threadId: Number){
    this.GET_THREAD_FILES = "threads/" + threadId + "/files";
    return this.singletonService.get(this.GET_THREAD_FILES);
  }

}
