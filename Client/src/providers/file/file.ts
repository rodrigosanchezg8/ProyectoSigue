import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Singleton} from "../singleton/singleton";

/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileProvider {

  UPLOAD_FILE: string;

  constructor(public http: HttpClient, private singletonService: Singleton) {
    console.log('Hello FileProvider Provider');
  }

  uploadFile(modelNamePlural, modelId, file){
    this.UPLOAD_FILE = modelNamePlural + "/" + modelId + "/file/upload";
    return this.singletonService.post(this.UPLOAD_FILE, file);
  }

}
