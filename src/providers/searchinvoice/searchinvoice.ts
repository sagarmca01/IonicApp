import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
/*
  Generated class for the SearchinvoiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchinvoiceProvider {

  constructor(public http: HttpClient, public api: Api) {
    console.log('Hello SearchinvoiceProvider Provider');
  }

  //Method for user search Invoice
  searchInvoice(searchInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('invoice_detail.php', this.getFormUrlEncoded(searchInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Search Invoice: ", res);     
          
    }, err => {
      console.error('ERROR Search Invoice: ', err);      
    });
    return seq;
  }


  //Method for user submit delivery
  submitDelivery(deliveryInfo: any) {
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('Deliver.php', this.getFormUrlEncoded(deliveryInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Delivery: ", res);     
          
    }, err => {
      console.error('ERROR Delivery: ', err);      
    });
    return seq;
  }

  //Method for return delivery
  returnDelivery(returnInfo: any){
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('Return.php', this.getFormUrlEncoded(returnInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Return: ", res);     
          
    }, err => {
      console.error('ERROR Return: ', err);      
    });
    return seq;
  }

  //Method for return delivery
  returnRequest(returnInfo: any){
    let reqOpts = {
      headers: {
        
       }
    };
    let seq = this.api.post('addMuReturnbase64.php', returnInfo, reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success ReturnRequest: ", res);              
    }, err => {
      console.error('ERROR ReturnRequest: ', err);      
    });
    return seq;
  }

  //Method for pickup delivery
  submitPickupData(pickupInfo: any){
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('pickup.php', this.getFormUrlEncoded(pickupInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Pickup Data: ", res);     
          
    }, err => {
      console.error('ERROR Pickup Data: ', err);      
    });
    return seq;
  }

  //Method for check pickup delivery
  checkPickupData(userInfo: any){
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('pickupcheck.php ', this.getFormUrlEncoded(userInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Pickup Data: ", res);     
          
    }, err => {
      console.error('ERROR Pickup Data: ', err);      
    });
    return seq;
  }

  //Method for get pending/upcoming deliveries 
  getPendingDelivery(userInfo:any){
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('pending_delivery.php', this.getFormUrlEncoded(userInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Pending Delivery: ", res);     
          
    }, err => {
      console.error('ERROR Pending Delivery: ', err);      
    });
    return seq;
  }

  //Method for get delivered/completed deliveries
  getDeliveredDelivery(userInfo:any){
    let reqOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    let seq = this.api.post('delivered.php', this.getFormUrlEncoded(userInfo), reqOpts).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log("Success Delivered Delivery: ", res);     
          
    }, err => {
      console.error('ERROR Delivered Delivery: ', err);      
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
