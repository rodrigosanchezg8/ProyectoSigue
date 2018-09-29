import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewGodsonPage } from './new-godson';

@NgModule({
  declarations: [
    NewGodsonPage,
  ],
  imports: [
    IonicPageModule.forChild(NewGodsonPage),
  ],
})
export class NewGodsonPageModule {}
