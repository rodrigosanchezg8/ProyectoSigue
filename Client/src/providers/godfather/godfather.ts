import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Singleton} from "../singleton/singleton";
import {Godfather} from "../../models/godfather";

@Injectable()
export class GodfatherProvider {

  UPLOAD_PROFILE_IMAGE: string;
  GODFATHER_URL = "godfathers";

  constructor(public http: HttpClient,
              public singletonService: Singleton) {
    console.log('Hello GodfatherProvider Provider');
  }

  postGodfather(godfather: Godfather) {
    return this.singletonService.post(this.GODFATHER_URL, godfather);
  }

  putGodfather(godfather: Godfather) {
    return this.singletonService.put(this.GODFATHER_URL + "/" + godfather.id, godfather);
  }

  getGodfathers() {
    return this.singletonService.get(this.GODFATHER_URL);
  }

  uploadProfileImage(formModel, userId) {
    this.UPLOAD_PROFILE_IMAGE = "/godfathers/" + userId + "/upload-profile-image";
    return this.singletonService.post(this.UPLOAD_PROFILE_IMAGE, formModel);
  }

  deleteGodfather(userId) {
    return this.singletonService.delete("godfathers/" + userId);
  }

}
