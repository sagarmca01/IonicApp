import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events, AlertController } from 'ionic-angular';
import { LetusKnowPage, MainPage, DepotPage, NotificationPage } from '../pages';
import { Settings } from '../providers';
import { FCM } from '@ionic-native/fcm';

//import { Push } from '@ionic-native/push/ngx';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar color="#0B418B">
        <ion-title><div style='width: 72%;'>Welcome <br> {{username}}</div>
        <div><img alt="logo" class="margin" height="25" style="float: right;" src="assets/img/image001.png" > </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;

  @ViewChild(Nav) nav: Nav;

  pages: any[];
  username: any;

  constructor(private translate: TranslateService, public fcm: FCM, public alertCtrl: AlertController, public platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();

      if (localStorage.getItem("userID") != '' && localStorage.getItem("userID") != undefined) {
        this.username = localStorage.getItem("displayName");
        if (localStorage.getItem("userType").toUpperCase() == "DEPOT") {
          this.rootPage = DepotPage;
          this.pages = [{ title: 'Logout', component: 'LoginPage' }];
        } else {
          this.rootPage = MainPage;
          this.pages = [{ title: 'Home', component: 'SearchInvoicePage' },
          { title: 'Upcoming Deliveries', component: 'PendingDeliveryPage' },
          { title: 'Completed Deliveries', component: 'DeliveredDeliveryPage' },
          { title: 'Logout', component: 'LoginPage' }
          ];
        }
      } else {
        this.rootPage = LetusKnowPage;
      }
    });
    this.initTranslate();

    this.events.subscribe('userRole', (role, name) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.username = name;
      if (role == "Depot") {
        this.pages = [{ title: 'Logout', component: 'LoginPage' }];
      } else {
        this.pages = [{ title: 'Home', component: 'SearchInvoicePage' },
        { title: 'Upcoming Deliveries', component: 'PendingDeliveryPage' },
        { title: 'Completed Deliveries', component: 'DeliveredDeliveryPage' },
        { title: 'Logout', component: 'LoginPage' }
        ];
      }
      console.log('Welcome', role);
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  initPushNotification() {
    this.fcm.getToken().then(token => {
      localStorage.setItem('FCMToken', token);
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
        if (localStorage.getItem("userID")) {
          this.rootPage = NotificationPage;
        } else {
          this.rootPage = LetusKnowPage;
        }
      } else {
        console.log("Received in foreground");
        if (localStorage.getItem('NotificationCount')) {
          var count = localStorage.getItem('NotificationCount');
          var nCount = parseInt(count) + 1;
          localStorage.setItem('NotificationCount', nCount.toString());
        } else {
          localStorage.setItem('NotificationCount', '1');
        }
        this.events.publish('Notification', localStorage.getItem('NotificationCount'));
      };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      localStorage.setItem('FCMToken', token);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == 'Logout') {
      localStorage.clear();
    }
    this.nav.setRoot(page.component);
  }
}
