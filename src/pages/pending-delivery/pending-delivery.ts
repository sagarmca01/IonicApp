import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SearchinvoiceProvider } from '../../providers/searchinvoice/searchinvoice';
import { DeliveryListPage } from '..';

/**
 * Generated class for the PendingDeliveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pending-delivery',
  templateUrl: 'pending-delivery.html',
})
export class PendingDeliveryPage {
  headingText: string;
  userInfo: { user_id: string, user_name: string } = { user_id: '', user_name: '' };
  pendingData: any[];
  searchInvoice: { Invoice_Number: string, user_id: string, user_type: string } = { Invoice_Number: '', user_id: '', user_type: '' };
  isCustomer: boolean;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public search: SearchinvoiceProvider) {
    this.getPendingDelivery();
    if (localStorage.getItem("userType").toUpperCase() == "CUSTOMER") {
      this.isCustomer = true;
    } else {
      this.isCustomer = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingDeliveryPage');
  }

  getPendingDelivery() {
    if (navigator.onLine) {
      this.userInfo.user_id = localStorage.getItem('userID');
      this.userInfo.user_name = localStorage.getItem('userName');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.getPendingDelivery(this.userInfo).subscribe((resp: any) => {
        loading.dismiss();
        if (resp != null) {
          if (resp.success == 'true') {
            if (resp.data != null && resp.data.length > 0) {
              this.headingText = 'Upcoming Deliveries';
              this.pendingData = resp.data;
            } else {
              this.headingText = 'No data available.';
              return;
            }
          } else {
            this.headingText = 'No data available.';
            this.showToast(resp.msg);
            return;
          }
        } else {
          this.headingText = 'No data available.';
          return;
        }
      }, (err) => {
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  getInvoiceDetail(InvoiceNumber: any) {
    if (navigator.onLine) {
      this.searchInvoice.Invoice_Number = InvoiceNumber;
      this.searchInvoice.user_id = localStorage.getItem("userID");
      this.searchInvoice.user_type = localStorage.getItem("userType");
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.searchInvoice(this.searchInvoice).subscribe((resp: any) => {
        loading.dismiss();
        if (resp != null) {
          if (resp.success == 'true') {
            this.navCtrl.push(DeliveryListPage, { searchData: resp.data, listData: resp.data1 });
          } else {
            this.showToast(resp.msg);
            return;
          }
        } else {
          this.showToast("Invoice not found.");
        }
      }, (err) => {
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  showToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
