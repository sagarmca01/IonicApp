import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { BannersProvider } from '../../providers/banners/banners';
import { LoginPage, MainPage, DepotPage } from '../';

/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  userInfo: { user_type: string } = { user_type: '' }

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public loadingCtrl: LoadingController, public banner: BannersProvider) {
    this.slides = [];
    this.userInfo.user_type = this.navParams.data.userType;
    this.getTutorialImages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  goToLogin() {
    if (this.userInfo.user_type.toUpperCase() == "CUSTOMER") {
      this.navCtrl.push(LoginPage);
    } else if (this.userInfo.user_type.toUpperCase() == "TRANSPORTER") {
      this.navCtrl.setRoot(MainPage);
    } else {
      this.navCtrl.setRoot(DepotPage);
    }
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  getTutorialImages() {
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

  showToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
