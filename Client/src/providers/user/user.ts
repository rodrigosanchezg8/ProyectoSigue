import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Singleton} from "../singleton/singleton";

@Injectable()
export class UserProvider {

  LOGIN = "login";
  BASE_URL = "users";

  constructor(public http: HttpClient, public singletonService: Singleton) {}

  validateUser(email, password){
    let userData = { "email": email, "password": password };
    return this.singletonService.post(this.LOGIN, userData, false);
  }

  updateFCMToken(id, token){
    let tokenData = { "fcm_token": token, 'user_id': id };
    let url = this.BASE_URL + "/fcm";
    return this.singletonService.put(url, tokenData, true);
  }

}
