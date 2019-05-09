import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../providers';
import { ResetPasswordPage } from '../';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  account: { username: string, phone: string } = {
    username: '',
    phone: ''
  };

  show: { username: boolean } = {
    username: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public user: User
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  valiadteOTP() {
    if (this.show.username) {
      if (this.account.username == '') {
        this.showToast('Username is required.');
        return;
      } else {
        this.account.phone = '';
        this.sendOTP();
      }
    } else {
      if (this.account.phone == '') {
        this.showToast('Mobile is required.');
        return;
      } else {
        this.account.username = '';
        this.sendOTP();
      }
    }
  }

  sendOTP() {
    if(navigator.onLine){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.user.sendOTP(this.account).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.success == 'true') {
        this.navCtrl.push(ResetPasswordPage,{value:this.account, otp:resp.otp});
      } else {
        this.showToast(resp.msg);
        return;
      }

    }, (err) => {
      loading.dismiss();
      this.showToast("Something went wrong please try again.");
    });
  }else{
    this.showToast("No network connection, Please try again.");
  }
  }


  segmentChanged(ev: any) {
    if (ev.value == "mobile") {
      this.show.username = false;
    } else {
      this.show.username = true;
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
