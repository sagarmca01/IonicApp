import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, MenuController, LoadingController, Events, Platform, NavParams } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage, TutorialPage } from '../';
import { Device } from '@ionic-native/device/ngx';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string, device_OS: string, device_token: string } = {
    username: '',
    password: '',
    device_OS: '',
    device_token: ''
  };

  letusKnowUserType: any;

  constructor(public navCtrl: NavController,
    private menu: MenuController,
    public user: User,
    public events: Events,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public device: Device,
    public navParams: NavParams) {
    this.platform.ready().then(() => {
      // this.account.device_OS = this.device.platform;
    });
    this.letusKnowUserType = '';
    if (this.navParams.data) {
      this.letusKnowUserType = this.navParams.data.userType;
    }
  }

  // Attempt to login in through our User service
  doLogin() {
    if (this.account.username == "") {
      this.showToast("Username is required.");
      return;
    }
    if (this.account.password == "") {
      this.showToast("Password is required.");
      return;
    }
    if (navigator.onLine) {
      if (this.platform.is('ios')) {
        this.account.device_OS = 'iOS';
      } else {
        this.account.device_OS = 'Android';
      }
      this.account.device_token = localStorage.getItem('FCMToken');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.user.login(this.account).subscribe((resp: any) => {
        loading.dismiss();
        //var data = JSON.parse(localStorage.getItem('userData'));
        if (resp.responseCode == 200) {
          if (resp.data.user_type.toUpperCase() == 'CUSTOMER') {
            this.events.publish('userRole', 'Customer', resp.data.DisplayName);
            this.navCtrl.setRoot(MainPage);
          } else {
            if (resp.data.user_type.toUpperCase() == 'TRANSPORTER') {
              this.events.publish('userRole', 'Customer', resp.data.DisplayName);
            } else {
              this.events.publish('userRole', 'Depot', resp.data.DisplayName);
            }
            this.navCtrl.setRoot(TutorialPage, { userType: resp.data.user_type });
            // this.navCtrl.setRoot(DepotPage);
          }
        } else {
          this.showToast(resp.responseMessage);
          return;
        }
      }, (err) => {
        // Unable to log in
        loading.dismiss();
        this.showToast("Something went wrong please try again.");
      });
    } else {
      this.showToast("No network connection, Please try again.");
    }
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    // Don't forget to return the swipe to normal, otherwise 
    // the rest of the pages won't be able to swipe to open menu
    this.menu.swipeEnable(true);
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
