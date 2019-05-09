import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchInvoicePage } from './search-invoice';

@NgModule({
  declarations: [
    SearchInvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchInvoicePage),
  ],
})
export class SearchInvoicePageModule {}
