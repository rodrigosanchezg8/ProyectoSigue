import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Singleton} from "../singleton/singleton";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file';

/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileProvider {

  fileTransfer: FileTransferObject;

  UPLOAD_FILE: string;

  constructor(public http: HttpClient, private singletonService: Singleton, private file: File, private transfer: FileTransfer) {
    console.log('Hello FileProvider Provider');
    this.fileTransfer = this.transfer.create();
  }

  uploadFile(modelNamePlural, modelId, file){
    this.UPLOAD_FILE = modelNamePlural + "/" + modelId + "/file/upload";
    return this.singletonService.post(this.UPLOAD_FILE, file);
  }

  download(file){
    return new Promise((resolve, reject) => {
      this.singletonService.getAuthHeaders().then(headers => {
        let encodedURI = encodeURI(this.singletonService.API + "files/" + file.id + "/download");
        resolve(this.fileTransfer.download(encodedURI, this.file.externalDataDirectory + file.name, true, headers));
      }).catch(e => reject(e));
    });
  }

}
