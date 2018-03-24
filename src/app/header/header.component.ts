import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

declare var $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CoinService],
})
export class HeaderComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 2000
  });

  public urlString: any = myGlobals.base_url;
  public login_ses: any = myGlobals.login_ses;
  public token: any = myGlobals.token;
  url: any;

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    console.log(this.token);
    this.toasterService = toasterService;
    if (this.login_ses == null || this.login_ses === '') {
      window.location.href = this.urlString + 'login';
    }
  }

  ngOnInit() {
    this.url = window.location.href;
    this.url = this.url.split('/');
    if (this.url[3] !== '') {
      this.url = this.url[3];
    } else {
      this.url = 'home';
    }
  }

  destroyUser() {
    localStorage.clear();
    location.href = this.urlString + 'login' ;
  }
}
