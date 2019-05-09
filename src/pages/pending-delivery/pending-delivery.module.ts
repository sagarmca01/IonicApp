import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingDeliveryPage } from './pending-delivery';

@NgModule({
  declarations: [
    PendingDeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingDeliveryPage),
  ],
})
export class PendingDeliveryPageModule {}
