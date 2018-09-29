import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    AlertController,
    IonicPage, NavController,
    NavParams,
    ToastController
} from 'ionic-angular';
import { GodsonProvider } from '../../../../providers/godson/godson';
import { Godson } from '../../../../models/godson';

@IonicPage()
@Component({
    selector: 'page-new-godson',
    templateUrl: 'new-godson.html',
})
export class NewGodsonPage {

    godson: Godson = new Godson();

    constructor(
        public navParams: NavParams,
        private godsonProvider: GodsonProvider,
        public alertCtrl: AlertController,
        public navCtrl: NavController
    ) { this.createForm(); }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegisterPage');
    }

    createForm() { }

    addNewGodson() {
        this.godsonProvider.postGodson({
            first_name: this.godson.firstName,
            last_name: this.godson.lastName,
            age: this.godson.age,
            orphan_house_id: 0,
            profile_image: '',
            status: 1
        })
        .then((response: any) => {
            response.subscribe(
                (response) => {
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                }
            );
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
