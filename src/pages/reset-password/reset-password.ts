import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../providers';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  serverotp: any;
  account: { phone: string, username: string, new_password: string, confirm_password: string, otp: string } = {
    phone: '',
    username: '',
    new_password: '',
    confirm_password: '',
    otp: ''
  }
  constructor(
    public user: User,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.serverotp = this.navParams.data.otp;
    this.account.username = this.navParams.data.value.username;
    this.account.phone = this.navParams.data.value.phone;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  resetPassword() {
    if (this.account.new_password == "") {
      this.showToast("Username is required.");
      return;
    }
    if (this.account.confirm_password == "") {
      this.showToast("Password is required.");
      return;
    }
    if (this.account.new_password != this.account.confirm_password) {
      this.showToast("New Password and Confirm Password doesn't match.");
      return;
    }
    if (this.account.otp == "") {
      this.showToast("OTP is required.");
      return;
    }
    if (this.account.otp != "") {
      if (this.serverotp != this.account.otp) {
        this.showToast("OTP doesn't match.");
        return;
      }
    }
    if (navigator.onLine) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.user.resetPassword(this.account).subscribe((resp: any) => {
        loading.dismiss();
        if (resp.success == "true") {
          this.showToast("Password successfully changed. Please login.");
          this.navCtrl.setRoot(LoginPage);
        }
        //this.navCtrl.setRoot(MainPage);
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
