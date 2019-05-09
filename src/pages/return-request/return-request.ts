import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { SearchinvoiceProvider } from '../../providers/searchinvoice/searchinvoice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Api, User } from '../../providers';

/**
 * Generated class for the ReturnRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-return-request',
  templateUrl: 'return-request.html',
})
export class ReturnRequestPage {
  returnPostData: { Invoice_Number: string, user_id: string, sku_code: string, Damage_qty: string, Quantity: string, Damage_type: string, Settlement: string, Remark: string, file: any[] } = {
    Invoice_Number: '', user_id: '', sku_code: '', Damage_qty: '', Damage_type: '', Quantity:'', Settlement: '', Remark: '', file: []
  };
  selectedData: any = 0;
  Settlement: any = 0;

  damageList: any[];

  public photos: any;
  public serverPhtot: any;
  public base64Image: string = '';

  constructor(
    public user: User,
    public search: SearchinvoiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public actionsheetCtrl: ActionSheetController,
    public platform: Platform,
    public api: Api,
    public alertCtrl: AlertController
  ) {
    this.getDamageList();
    this.photos = [];
    this.serverPhtot = [];
    this.returnPostData.sku_code = this.navParams.data.itemData.SKU_code;
    this.returnPostData.Damage_qty = this.navParams.data.itemData.Damage_qty;
    this.returnPostData.Quantity = this.navParams.data.itemData.Quantity;
    this.returnPostData.Invoice_Number = this.navParams.data.InvoiceNumber;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReturnRequestPage');
  }
  optionsFn() {
    this.returnPostData.Damage_type = this.selectedData;
  }
  // settlementFn() {
  //   this.returnPostData.Settlement = this.Settlement;
  // }

  getDamageList() {
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.user.getDamageList().subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.success == "true") {
          this.damageList = resp.data1;
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

  returnRequest() {
    if (this.returnPostData.sku_code == "") {
      this.showToast("SKU code is required.");
      return;
    }
    if (this.returnPostData.Damage_qty == "") {
      this.showToast("Damage quantity is required.");
      return;
    }
    if (this.returnPostData.Damage_qty > this.returnPostData.Quantity) {
      this.showToast("Damage quantity should not greater than actual quantity.");
      return;
    }
    if (this.returnPostData.Damage_type == '0') {
      this.showToast("Please select damage type.");
      return;
    }
    // if (this.returnPostData.Settlement == '0') {
    //   this.showToast("Please select a settlement.");
    //   return;
    // }
    if (this.returnPostData.Remark == "") {
      this.showToast("Remark is required.");
      return;
    }
    if (this.photos.length == 0) {
      this.showToast("Product image is required.");
      return;
    }
    if (this.photos.length > 3) {
      this.showToast("You can't upload image more than 3.");
      return;
    }

    this.returnPostData.user_id = localStorage.getItem('userID');
    let loading = this.loadingCtrl.create({ content: 'Uploading...', });
    loading.present();
    var form = new FormData();
    for (var i = 0; i < this.serverPhtot.length; i++) {
      form.append("photo[]", this.serverPhtot[i]);
    }
    form.append("Invoice_Number", this.returnPostData.Invoice_Number);
    form.append("user_id", this.returnPostData.user_id);
    form.append("sku_code", this.returnPostData.sku_code);
    form.append("Damage_qty", this.returnPostData.Damage_qty);
    form.append("Damage_type", this.returnPostData.Damage_type);
    form.append("Settlement", this.returnPostData.Settlement);
    form.append("Remark", this.returnPostData.Remark);
    this.search.returnRequest(form).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.success == "true") {
        this.showToast(resp.msg);
        this.doEmptyData();
      } else {
        this.showToast(resp.msg);
        return;
      }
    }, (err) => {
      //this.navCtrl.setRoot(MainPage);
      loading.dismiss();
      this.showToast("Something went wrong please try again.");
    });
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
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.serverPhtot.push(imageData);
      this.photos.reverse();
      this.serverPhtot.reverse();
      //this.upload_Return_Pic();
    }, (err) => {
      this.showToast("Operation close by user.");
    });
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
            this.serverPhtot.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  doEmptyData() {
    this.returnPostData.Settlement = '';
    this.returnPostData.Damage_qty = '';
    this.returnPostData.Remark = '';
    this.photos = [];
    this.serverPhtot = [];
    this.selectedData = 0;
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
