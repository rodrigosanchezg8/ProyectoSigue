import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Singleton} from "../singleton/singleton";
import {Godfather} from "../../models/godfather";

@Injectable()
export class GodfatherProvider {

  UPLOAD_PROFILE_IMAGE: string;
  GODFATHER_URL = "godfathers";
  GODFATHER_GODSONS_ULR = 'godfathers/{godfatherId}/godsons';

  constructor(public http: HttpClient,
              public singletonService: Singleton) {
    console.log('Hello GodfatherProvider Provider');
  }

  getGodfathers() {
    return this.singletonService.get(this.GODFATHER_URL);
  }

  getGodsonsByGodfatherId(godfatherId) {
    return this.singletonService.get(
      this.GODFATHER_GODSONS_ULR.replace('{godfatherId}', godfatherId), 
      true
    );
  }

  getGodfather(id){
    return this.singletonService.get(this.GODFATHER_URL + "/" + id);
  }

  postGodfather(godfather: Godfather) {
    return this.singletonService.post(this.GODFATHER_URL, godfather);
  }

  putGodfather(godfather: Godfather) {
    return this.singletonService.put(this.GODFATHER_URL + "/" + godfather.id, godfather);
  }

  uploadProfileImage(formModel, userId) {
    this.UPLOAD_PROFILE_IMAGE = "/godfathers/" + userId + "/upload-profile-image";
    return this.singletonService.post(this.UPLOAD_PROFILE_IMAGE, formModel);
  }

  deleteGodfather(userId) {
    return this.singletonService.delete("godfathers/" + userId);
  }

}
