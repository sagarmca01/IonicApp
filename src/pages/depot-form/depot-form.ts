import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { SearchinvoiceProvider } from '../../providers/searchinvoice/searchinvoice';
import { User } from '../../providers';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the DepotFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-depot-form',
  templateUrl: 'depot-form.html',
})
export class DepotFormPage {
  pickupData: { Invoice_Number: string, POD_Pic: string, DC_Number: string, user_id: string, Transporter_Name: string, POD_Number: string, Vehicle_Number: string, Pickup_Date: any, Pickup_Person_Name: string, Pickup_Mobile: string, Number_of_Pieces: string } = {
    Invoice_Number: '', POD_Pic: '', DC_Number: '', user_id: '', Transporter_Name: '', POD_Number: '', Vehicle_Number: '', Pickup_Date: '', Pickup_Person_Name: '', Pickup_Mobile: '', Number_of_Pieces: ''
  };
  userInfo:{user_id:string, Invoice_Number:string}={user_id:'',Invoice_Number:''};
  notificationCount:any;
  transPorterList:any[];
  selectedData:any=0;
  public photo: any;
  public base64Image : string;

  constructor(
    public events: Events,
    public search: SearchinvoiceProvider,
    public user:User, 
    public camera:Camera,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.photo = '';
    this.getTransporterList();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    this.pickupData.Pickup_Date = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);

    if (localStorage.getItem('NotificationCount')) {
      this.notificationCount = localStorage.getItem('NotificationCount');
    } else {
      this.notificationCount = '';
    }
    this.events.subscribe('Notification', (Count) => {
      this.notificationCount = Count;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepotFormPage');
  }

  optionsFn(){
    console.log(this.selectedData);
    this.pickupData.Transporter_Name = this.selectedData;
  }

  submitPickup() {
    if (this.pickupData.Invoice_Number == '') {
      this.showToast('Invoice number is required.');
      return;
    }
    
    if (this.pickupData.Transporter_Name == '0') {
      this.showToast('Please select transport company.');
      return;
    }
    if (this.pickupData.POD_Number == '') {
      this.showToast('POD number is required.');
      return;
    }
    if (this.pickupData.Vehicle_Number == '') {
      this.showToast('Vehicle number is required.');
      return;
    }
    if (this.pickupData.Pickup_Date == '') {
      this.showToast('Pickup date is required.');
      return;
    }
    if (this.pickupData.Pickup_Person_Name == '') {
      this.showToast('Pickup person name is required.');
      return;
    }
    if (this.pickupData.Pickup_Mobile == '') {
      this.showToast('Pickup person mobile number is required.');
      return;
    }else{
      if(this.pickupData.Pickup_Mobile.length!=10){
        this.showToast('Mobile number should be 10 digit.');
        return;
      }
    }
    if (this.pickupData.Number_of_Pieces == '') {
      this.showToast('Product pices is required.');
      return;
    }
    if (this.pickupData.POD_Pic == '') {
      this.showToast('POD image is required.');
      return;
    }
    this.pickupData.user_id= localStorage.getItem('userID');
    this.submitPickupData();
  }

  submitPickupData() {
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.submitPickupData(this.pickupData).subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {
          this.showToast(resp.msg);
          this.doEmptyData();
          // this.navCtrl.setRoot(SearchInvoicePage);
        } else {
          this.showToast(resp.msg);
          return;
        }
      }, (err) => {
        //this.navCtrl.setRoot(MainPage);
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  checkPickup() {
    if (navigator.onLine) {
      this.userInfo.Invoice_Number = this.pickupData.Invoice_Number;
      this.userInfo.user_id = localStorage.getItem('userID');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.search.checkPickupData(this.userInfo).subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {
          this.showToast(resp.msg);
          //this.submitPickupData();
        } else {
          this.showToast(resp.msg);
          return;
        }
      }, (err) => {
        //this.navCtrl.setRoot(MainPage);
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  getTransporterList(){
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.user.getTrasporterList().subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {          
          this.transPorterList = resp.data1;
        } else {
          this.showToast(resp.responseMessage);
          return;
        }
      }, (err) => {
        //this.navCtrl.setRoot(MainPage);
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  captureImage(useAlbum: boolean) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      ...useAlbum ? { sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM } : {}
    }
    this.camera.getPicture(options).then((imageData) => {
      this.photo='data:image/jpeg;base64,'+imageData;
      this.pickupData.POD_Pic = imageData;
    }, (err) => {
      this.showToast("Operation close by user.");
    });
  }

  doEmptyData(){
    this.pickupData.Invoice_Number='';
    this.pickupData.DC_Number='';
    this.pickupData.POD_Number='';
    this.pickupData.POD_Pic='';
    this.pickupData.Vehicle_Number='';
    this.pickupData.Pickup_Person_Name='';
    this.pickupData.Pickup_Mobile='';
    this.pickupData.Number_of_Pieces='';
    this.photo='';
    this.selectedData=0;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    this.pickupData.Pickup_Date = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
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
