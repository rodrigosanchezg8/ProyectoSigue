import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewGodsonPage } from './new-godson';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    NewGodsonPage,
  ],
  imports: [
    IonicPageModule.forChild(NewGodsonPage),
    IonicSelectableModule
  ],
})
export class NewGodsonPageModule {}
