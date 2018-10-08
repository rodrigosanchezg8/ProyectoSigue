import { Component } from '@angular/core';
import {
    AlertController,
    IonicPage, 
    NavController,
    NavParams,
    Events
} from 'ionic-angular';
import { GodsonProvider } from '../../../../providers/godson/godson';
import { Godson } from '../../../../models/godson';
import { GodfatherProvider } from '../../../../providers/godfather/godfather';

@IonicPage()
@Component({
    selector: 'page-new-godson',
    templateUrl: 'new-godson.html',
})
export class NewGodsonPage {

    godson: Godson;
    isEditMode: boolean;
    godfathers: any;
    selectedGodfather: any;

    constructor(
        public navParams: NavParams,
        private godsonProvider: GodsonProvider,
        private godfatherProvider: GodfatherProvider,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public events: Events
    ) {
        this.godson = navParams.get('godson');

        if (this.godson) {
            this.isEditMode = true;
        } else {
            this.godson = new Godson();
            this.isEditMode = false;
        }
    }

    ionViewDidLoad() {
        this.godfatherProvider.getGodfathers()
        .then((observable: any) => {
            observable.subscribe(
                (success) => {
                    this.godfathers = success;
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
        console.log(this.selectedGodfather);
        return this.godsonProvider.postGodson({
            first_name: this.godson.first_name,
            last_name: this.godson.last_name,
            age: this.godson.age,
            orphan_house_id: 0,
            profile_image: '',
            status: 1,
            godfather_id: this.selectedGodfather
        });
    }

    editGodson(){
        return this.godsonProvider.putGodson({
            id: this.godson.id,
            first_name: this.godson.first_name,
            last_name: this.godson.last_name,
            age: this.godson.age,
            orphan_house_id: 0,
            profile_image: '',
            status: 1
        });
    }

    responseHandler(response: any) {
        response.subscribe(
            (success) => {
                this.events.publish('godson:reload-list');
                this.navCtrl.pop();
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
