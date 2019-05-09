import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ImageViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-viewer',
  templateUrl: 'image-viewer.html',
})
export class ImageViewerPage {
  imgURL:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.imgURL = this.navParams.data.imageUrl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageViewerPage');
  }

}
