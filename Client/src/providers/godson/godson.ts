import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Singleton } from '../singleton/singleton';

@Injectable()
export class GodsonProvider {

  BASE_URL = 'godsons';

  constructor(
    public http: HttpClient,
    private singletonService: Singleton
  ) {

  }

  getGodsons() {
    return this.singletonService.get(this.BASE_URL, true);
  }

  getGodsonsByGodfatherId(godfatherId) {
    return this.singletonService.get(this.BASE_URL, true);
  }

  postGodson(godson) {
    return this.singletonService.post(this.BASE_URL, godson, true);
  }

  putGodson(godson) {
    return this.singletonService.put(
      this.BASE_URL + '/' + godson.id,
      godson,
      true
    );
  }

  // TODO: Fix delete method on singleton service, it needs to catch
  // which item is deleting
  deleteGodson(godsonId) {
    return this.singletonService.delete(
      this.BASE_URL + '/' + godsonId,
      true
    );
  }

}
