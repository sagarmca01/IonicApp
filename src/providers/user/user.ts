import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';


@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  //Method for user login
  login(accountInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('login.php', this.getFormUrlEncoded(accountInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      console.log("Success Login: ", res);
      localStorage.setItem('userData', JSON.stringify(res));
      localStorage.setItem('userType', res.data.user_type);
      localStorage.setItem('userID', res.data.user_id);
      localStorage.setItem('userName', res.data.username);
      localStorage.setItem('displayName', res.data.DisplayName);
    }, err => {
      console.log('ERROR Login: ', err);
      localStorage.setItem('userData', '');
      localStorage.setItem('userType', '');
    });

    return seq;
  }

  //Method for user forgot password to send OTP
  sendOTP(otpInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('forgot_password.php', this.getFormUrlEncoded(otpInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      console.log('Success send OTP: ', res);
    }, err => {
      console.error('ERROR send OTP: ', err);
    });

    return seq;
  }

  //Method for reset password
  resetPassword(accountInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('change_password.php', this.getFormUrlEncoded(accountInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      console.log("Success reset password: ", res);
    }, err => {
      console.log('ERROR reset password: ', err);
    });
    return seq;
  }

  //Get transporter list for depot
  getTrasporterList() {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.get('transportmaster.php', '', reqOpts).share();
    seq.subscribe((res: any) => {
      console.log("Success Transporter List: ", res);
    }, err => {
      console.log('ERROR Transporter List: ', err);
    });
    return seq;
  }

  //Get Damaged list for depot
  getDamageList() {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.get('Defectmaster.php', '', reqOpts).share();
    seq.subscribe((res: any) => {
      console.log("Success Damage Master List: ", res);
    }, err => {
      console.log('ERROR Damage Master List: ', err);
    });
    return seq;
  }


  //Get notification list for Notification screen
  getNotificationList(userInfo:any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('notification.php', this.getFormUrlEncoded(userInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      console.log("Success Notification List: ", res);
    }, err => {
      console.log('ERROR Notification List: ', err);
    });
    return seq;
  }
  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }

  getFormUrlEncoded(toConvert) {
    const formBody = [];
    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }
}
