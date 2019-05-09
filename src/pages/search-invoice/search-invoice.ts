import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { SearchinvoiceProvider } from '../../providers/searchinvoice/searchinvoice';
import { DeliveryListPage } from '../';
import { BannersProvider } from '../../providers/banners/banners';
/**
 * Generated class for the SearchInvoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Slide {
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-search-invoice',
  templateUrl: 'search-invoice.html',
})
export class SearchInvoicePage {
  public refresherEnabled: any;
  notificationCount:any;
  slides: Slide[];
  dir: string = 'ltr';
  userInfo: { user_type: string } = { user_type: '' }

  userInfoForList: { user_id: string, user_name: string } = { user_id: '', user_name: '' };
  pendingData: any[];
  deliveredData: any[];

  searchInvoice: { DC_Number: string, POD_Number: string, Invoice_Number: string, user_id: string, user_type: string } = {
    DC_Number: '',
    POD_Number: '',
    Invoice_Number: '',
    user_id: '',
    user_type: ''
  }

  constructor(
    public search: SearchinvoiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public banner: BannersProvider,
    public events:Events
  ) {
    this.userInfo.user_type = "Banner";
    this.pendingData = [];
    this.deliveredData = [];
    this.getBannerImages();
    this.getDeliveredDelivery();
    this.getPendingDelivery();
    if(localStorage.getItem('NotificationCount')){
      this.notificationCount = localStorage.getItem('NotificationCount');
  }else{
    this.notificationCount = '';
  }
    this.events.subscribe('Notification', (Count) => {
      this.notificationCount = Count;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchInvoicePage');
  }
  onSlideChangeStart(slider) {

  }

  doRefresh() {
    console.log('Begin async operation');   
      this.pendingData = [];
      this.deliveredData = [];
      this.getDeliveredDelivery();
      this.getPendingDelivery();      
      
  }

  searchInvoiceWithNumber(number: any) {
    if (number == 'DCNUMBER') {
      if (this.searchInvoice.DC_Number == "") {
        this.showToast("DC number is required.");
        return;
      } else {
        this.searchInvoice.Invoice_Number = '';
        this.searchInvoice.POD_Number = '';
        this.searchInvoiceData();
      }

    } else if (number == 'PODNUMBER') {
      if (this.searchInvoice.POD_Number == "") {
        this.showToast("POD number is required.");
        return;
      } else {
        this.searchInvoice.DC_Number = '';
        this.searchInvoice.Invoice_Number = ''
        this.searchInvoiceData();
      }
    } else {
      if (this.searchInvoice.Invoice_Number == "") {
        this.showToast("INVOICE number is required.");
        return;
      } else {
        this.searchInvoice.POD_Number = '';
        this.searchInvoice.DC_Number = '';
        this.searchInvoiceData();
      }
    }
  }

  searchInvoiceData() {
    if (navigator.onLine) {
      this.searchInvoice.user_id = localStorage.getItem('userID');
      this.searchInvoice.user_type = localStorage.getItem('userType');
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

  getBannerImages() {
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.banner.getTutorialImages(this.userInfo).subscribe((resp: any) => {
        loading.dismiss();
        if (resp.success == 'true') {
          this.slides = resp.data1;

        } else {
          this.showToast(resp.msg);
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

  getDeliveredDelivery() {
    if (navigator.onLine) {
      this.userInfoForList.user_id = localStorage.getItem('userID');
      this.userInfoForList.user_name = localStorage.getItem('userName');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.getDeliveredDelivery(this.userInfoForList).subscribe((resp: any) => {
        loading.dismiss();
        if (resp != null) {
          if (resp.success == 'true') {
            if(resp.data != null){
            if(resp.data.length>0){
              for(var i=0;i<resp.data.length;i++){
                this.deliveredData.push(resp.data[i]);
                if(i==2){
                  return;
                }
              }
            } 
          }
          } else {
            this.showToast(resp.msg);
          }
          if(this.deliveredData.length<3){
            for(let j = this.deliveredData.length; j<3;j++){
              var obj={
                Invoice_Id: "--",
                PARTYNAME: "--",
                Statusdate: "--",
                Transporter_id: "--",
                invoice_date: "--",
                invoice_number: "--",
                sku_code: "--",
                status: "--"
              }
              this.deliveredData.push(obj);
            }
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

  getPendingDelivery() {
    if (navigator.onLine) {
      this.userInfoForList.user_id = localStorage.getItem('userID');
      this.userInfoForList.user_name = localStorage.getItem('userName');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.getPendingDelivery(this.userInfoForList).subscribe((resp: any) => {
        loading.dismiss();
        if (resp != null) {
          if (resp.success == 'true') {
            if(resp.data != null){
            if(resp.data.length>0){
              for(var i=0;i<resp.data.length;i++){
                this.pendingData.push(resp.data[i]);
                if(i==2){
                  return;
                }
              }
            } 
          }           
          } else {
            this.showToast(resp.msg);
          }
          if(this.pendingData.length<3){
            for(let j = this.pendingData.length; j<3;j++){
              var obj={
                Invoice_Id: "--",
                PARTYNAME: "--",
                Statusdate: "--",
                Transporter_id: "--",
                invoice_date: "--",
                invoice_number: "--",
                sku_code: "--",
                status: "--"
              }
              this.pendingData.push(obj);
            }
          }
        } else {
          this.showToast("Pending delivery not found.");
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

  getInvoiceDetail(InvoiceNumber:any){
    if (navigator.onLine) {
      this.searchInvoice.Invoice_Number = InvoiceNumber;
      this.searchInvoice.user_id = localStorage.getItem("userID");
      this.searchInvoice.user_type = localStorage.getItem("userType");
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.searchInvoice(this.searchInvoice).subscribe((resp: any) => {
        loading.dismiss();
        if(resp!=null){
        if (resp.success == 'true') {
          this.navCtrl.push(DeliveryListPage, { searchData: resp.data, listData: resp.data1 });
        } else {
          this.showToast(resp.msg);
          return;
        }}else{
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
