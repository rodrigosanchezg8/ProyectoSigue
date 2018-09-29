import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    AlertController,
    IonicPage, 
    NavController,
    NavParams
} from 'ionic-angular';
import { GodsonProvider } from '../../../../providers/godson/godson';
import { Godson } from '../../../../models/godson';
import { resolveDefinition } from '@angular/core/src/view/util';

@IonicPage()
@Component({
    selector: 'page-new-godson',
    templateUrl: 'new-godson.html',
})
export class NewGodsonPage {

    godson: Godson;
    isEditMode: boolean;

    constructor(
        public navParams: NavParams,
        private godsonProvider: GodsonProvider,
        public alertCtrl: AlertController
    ) {
        this.godson = navParams.get('godson');

        if (this.godson) {
            this.isEditMode = true;
        } else {
            this.godson = new Godson();
            this.isEditMode = false;
        }
    }

    ionViewDidLoad() {}

    sendRequest() {
        if (this.isEditMode) {
            this.editGodson()
            .then((res: any) => this.responseHandler(res))
            .catch((error) => console.log(error));
        } else {
            this.addNewGodson()
            .then((res: any) => this.responseHandler(res))
            .catch((error) => console.log(error));
        }
    }

    addNewGodson() {
        return this.godsonProvider.postGodson({
            first_name: this.godson.firstName,
            last_name: this.godson.lastName,
            age: this.godson.age,
            orphan_house_id: 0,
            profile_image: '',
            status: 1
        });
    }

    editGodson(){
        return this.godsonProvider.putGodson({
            id: this.godson.id,
            first_name: this.godson.firstName,
            last_name: this.godson.lastName,
            age: this.godson.age,
            orphan_house_id: 0,
            profile_image: '',
            status: 1
        });
    }

    responseHandler(response: any) {
        response.subscribe(
            (success) => {
                console.log(success);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
