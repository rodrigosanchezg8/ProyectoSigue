import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GodsonsPage } from './godsons';

@NgModule({
  declarations: [
    GodsonsPage,
  ],
  imports: [
    IonicPageModule.forChild(GodsonsPage),
  ],
})
export class GodsonsPageModule {}
