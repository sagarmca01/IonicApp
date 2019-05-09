import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { SearchinvoiceProvider } from '../../providers/searchinvoice/searchinvoice';
import { ReturnRequestPage, MainPage, ImageViewerPage } from '../';

/**
 * Generated class for the DeliveryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delivery-list',
  templateUrl: 'delivery-list.html',
})
export class DeliveryListPage {
  listobj: { Invoice_Id: string, 
    Depot_id: string, 
    Invoice_Number: string, 
    Invoice_Date: string, 
    DC_Number: string, 
    POD_Number: string, 
    POD_Image:string,
    Party_Name: string, 
    Customer_Contact_Name1: string, 
    Customer_Contact_Number1: string,
    Customer_Contact_Name2: string, 
    Customer_Contact_Number2: string, 
    createdate: string, bstatus:string,
    pdate:string, DStatusdate:string,
    Delivered:string,
    Dstatus:string } = {
    Invoice_Id: '', 
    Depot_id: '', 
    Invoice_Number: '', 
    Invoice_Date: '', 
    DC_Number: '', 
    POD_Number: '', 
    POD_Image:'',
    Party_Name: '', 
    Customer_Contact_Name1: '', 
    Customer_Contact_Number1: '', 
    Customer_Contact_Name2: '', 
    Customer_Contact_Number2: '', 
    createdate: '', bstatus:'',
    pdate:'', DStatusdate:'',
    Delivered:'',
    Dstatus:''
  };
  postData: { Invoice_Number: string, user_id: string, Receiver_Name: string, Receiver_Number: string, Deliver_Name: string, Deliver_Number: string } = {
    Invoice_Number: '', user_id: '', Receiver_Name: '', Receiver_Number: '', Deliver_Name: '', Deliver_Number: ''
  };

  returnPostData: { Invoice_Id: string, user_id: string, Return_Remark: string } = {
    Invoice_Id: '', user_id: '', Return_Remark: ''
  };
  userType: { isCustomer: boolean } = {
    isCustomer: true
  }
  btnShow:{bstatus:boolean}={
    bstatus:true
  }
  currentSelected:Number=null;
  itemClickList:any=null;

  public listData: any;

  constructor(
    public search: SearchinvoiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    // this.listobj = this.navParams.data;
     
    console.log('data', this.navParams.data);
    this.listobj.Invoice_Id = this.navParams.data.searchData.Invoice_Id;
    this.listobj.Invoice_Date = this.dateFormate(this.navParams.data.searchData.Invoice_Date);
    this.listobj.Invoice_Number = this.navParams.data.searchData.Invoice_Number;
    this.listobj.Depot_id = this.navParams.data.searchData.Depot_id;
    this.listobj.DC_Number = this.navParams.data.searchData.DC_Number;
    this.listobj.POD_Number = this.navParams.data.searchData.POD_Number;
    this.listobj.POD_Image = this.navParams.data.searchData.podpath1;
    this.listobj.Party_Name = this.navParams.data.searchData.Party_Name;
    this.listobj.Customer_Contact_Name1 = this.navParams.data.searchData.Contact_Name1;
    this.listobj.Customer_Contact_Number1 = this.navParams.data.searchData.Contact_Number1;
    this.listobj.Customer_Contact_Name2 = this.navParams.data.searchData.Contact_Name2;
    this.listobj.Customer_Contact_Number2 = this.navParams.data.searchData.Contact_Number2;
    this.listobj.createdate = this.navParams.data.searchData.createdate;
    this.listobj.pdate = this.dateFormate(this.navParams.data.searchData.pdate);
    this.listobj.DStatusdate = this.dateFormate(this.navParams.data.searchData.DStatusdate);
    this.listobj.Dstatus = this.navParams.data.searchData.Dstatus;
    this.listobj.bstatus = this.navParams.data.searchData.bstatus;
    this.listobj.Delivered = this.navParams.data.searchData.Delivered;
    if(this.listobj.bstatus == '1'){
      this.btnShow.bstatus = true;
    }else{
      this.btnShow.bstatus = false;
    }
    this.listData = this.navParams.data.listData;
    console.log(this.listData);
    if (localStorage.getItem('userType').toUpperCase() == 'CUSTOMER') {
      this.userType.isCustomer = true;
    } else {
      this.userType.isCustomer = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryListPage');
  }
  onItemClicked(idx, item) {
    this.currentSelected = idx;
    this.itemClickList = item;
}

  promptDeliveryDetail() {
    let alert = this.alertCtrl.create({
      title: 'Enter Delivery Detail',
      inputs: [
        {
          name: 'deliversname',
          placeholder: 'Delivers Name',
          type: 'text'
        },
        {
          id:'deliverMobile',
          name: 'deliversmobileno',
          placeholder: 'Delivers Mobile No',
          type: 'tel'
        },
        {
          name: 'receiversname',
          placeholder: 'Receivers Name',
          type: 'text'
        },
        {
          id:'receiverMobile',
          name: 'receiversmobileno',
          placeholder: 'Receivers Mobile No',
          type: 'tel'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log(data.deliversname);
            if (data.deliversname == "") {
              this.showToast('Deliver name is required.');
              return false;
            }
            if (data.deliversmobileno == "") {
              this.showToast('Deliver Mobile number is required.');
              return false;
            }else{
              if(data.deliversmobileno.length!=10 ){
                this.showToast('Mobile number should be 10 digit.');
                return false;
              }
            }
            if (data.receiversname == "") {
              this.showToast('Receiver name is required.');
              return false;
            }
            if (data.receiversmobileno == "") {
              this.showToast('Receiver mobile number is required.');
              return false;
            }else{
              if(data.receiversmobileno.length!=10){
                this.showToast('Mobile number should be 10 digit.');
                return false;
              }
            }
            this.postData.Deliver_Name = data.deliversname;
            this.postData.Deliver_Number = data.deliversmobileno;
            this.postData.Receiver_Name = data.receiversname;
            this.postData.Receiver_Number = data.receiversmobileno;
            this.postData.Invoice_Number = this.listobj.Invoice_Number;
            this.postData.user_id = localStorage.getItem('userID');
            this.submitDeliver();
          }
        }
      ]
    });
    alert.present().then(()=>{
      document.getElementById('deliverMobile').setAttribute('maxlength','10');
      document.getElementById('receiverMobile').setAttribute('maxlength','10');
    });
  }

  promptRetunReason() {
    let alert = this.alertCtrl.create({
      title: 'Enter Return Reason',
      inputs: [
        {
          name: 'returnreason',
          placeholder: 'Return Reason',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            if (data.returnreason == "") {
              this.showToast('Return reason is required');
              return false;
            }
            this.returnPostData.Invoice_Id = this.listobj.Invoice_Id;
            this.returnPostData.user_id = localStorage.getItem('userID');;
            this.returnPostData.Return_Remark = data.returnreason;
            this.returnDeliver();
          }
        }
      ]
    });
    alert.present();
  }

  submitDeliver() {
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.submitDelivery(this.postData).subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {
          this.showToast(resp.msg);
          this.navCtrl.setRoot(MainPage);
        } else {
          this.showToast(resp.msg);
          return;
        }
      }, (err) => {
        //this.navCtrl.setRoot(MainPage);
        loading.dismiss();
        this.showToast("Something went wrong, Please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }


  returnDeliver() {
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.returnDelivery(this.returnPostData).subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {
          this.showToast(resp.msg);
          this.navCtrl.setRoot(MainPage);
        } else {
          this.showToast(resp.msg);
          return;
        }
      }, (err) => {
        //this.navCtrl.setRoot(MainPage);
        loading.dismiss();
        this.showToast("Something went wrong, Please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  goToReturnRequest() {
    if(this.itemClickList!=null){
    this.navCtrl.push(ReturnRequestPage, { InvoiceNumber: this.listobj.Invoice_Number, itemData:this.itemClickList });
    }else{
      this.showToast('Please select one product in the item.')
    }
  }

  presentImage(){
     let imgURL = encodeURI(this.listobj.POD_Image);
     console.log("image", imgURL);
    this.navCtrl.push(ImageViewerPage,{imageUrl:imgURL});
  }

  dateFormate(datePass:any){
    if(datePass != '0000-00-00'){
      if(datePass.length>12){
        datePass = datePass.split(' ')[0];
      }
      let date = new Date(datePass);
      return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
    }else{
      return '';
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
