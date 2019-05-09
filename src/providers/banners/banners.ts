import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the BannersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BannersProvider {

  constructor(public http: HttpClient, public api:Api) {
    console.log('Hello BannersProvider Provider');
  }

  //Method for user search Invoice
  getTutorialImages(userInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('displayimage.php', this.getFormUrlEncoded(userInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Search Invoice: ", res);     
          
    }, err => {
      console.error('ERROR Search Invoice: ', err);      
    });
    return seq;
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
