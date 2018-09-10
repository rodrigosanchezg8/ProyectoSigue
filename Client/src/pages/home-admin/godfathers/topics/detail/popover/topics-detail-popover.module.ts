import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicsDetailPopoverPage } from './topics-detail-popover';

@NgModule({
  declarations: [
    TopicsDetailPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicsDetailPopoverPage),
  ],
})
export class TopicsDetailPopoverPageModule {}
