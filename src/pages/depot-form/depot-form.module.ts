import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepotFormPage } from './depot-form';

@NgModule({
  declarations: [
    DepotFormPage,
  ],
  imports: [
    IonicPageModule.forChild(DepotFormPage),
  ],
})
export class DepotFormPageModule {}
