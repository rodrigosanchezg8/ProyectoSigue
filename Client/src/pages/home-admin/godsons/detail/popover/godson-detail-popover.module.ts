import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GodsonDetailPopoverPage } from './godson-detail-popover';

@NgModule({
  declarations: [
    GodsonDetailPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(GodsonDetailPopoverPage),
  ],
})
export class GodsonDetailPopoverPageModule {}
