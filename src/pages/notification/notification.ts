import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  account: { user_id: string, user_type:string } = { user_id: '', user_type:'' };
  notificationData:any[];
  headingText:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public user: User, public toastCtrl: ToastController) {
  this.getNotificationList();
  localStorage.setItem('NotificationCount','');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  getNotificationList() {
    if (navigator.onLine) {
      this.account.user_id = localStorage.getItem('userID');
      this.account.user_type = localStorage.getItem('userType');
      let loading = this.loadingCtrl.create();
      loading.present();
      this.user.getNotificationList(this.account).subscribe((resp: any) => {
        loading.dismiss();
        if (resp.success == 'true') {
          if(resp.data!=null && resp.data.length>0){
            this.headingText = "Notifications";
            this.notificationData = resp.data;
          }else{
            this.headingText = "No data available.";
            this.showToast(resp.msg);
          }
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

  dateFormate(dateString: string){
    if(dateString != '0000-00-00 00:00:00'){
      dateString = dateString.replace(/ /g,"T");
      return dateString;
    }else{
      return "";
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
