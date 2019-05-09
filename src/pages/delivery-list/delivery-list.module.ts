import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryListPage } from './delivery-list';

@NgModule({
  declarations: [
    DeliveryListPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryListPage),
  ],
})
export class DeliveryListPageModule {}
