import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateNewPage } from './create-new';

@NgModule({
  declarations: [
    CreateNewPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateNewPage),
  ],
})
export class CreateNewPageModule {}
