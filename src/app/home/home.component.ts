import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CoinService],
})
export class HomeComponent implements OnInit {

  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 2000
  });

  public urlString: any = myGlobals.base_url;
  activeuser: any;
  inactiveuser: any;
  blockuser: any;
  totalcoin: any;
  newcoin: any;
  activecoin: any;
  inactivecoin: any;

  constructor(private coinservice: CoinService, private router: Router, private http: Http, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.totalactiveuser().subscribe(resData => {
      if (resData.status === true) {
        this.activeuser = resData.data.activeuser;
      } else {
        this.activeuser = 0;
      }
    });
    this.coinservice.totalinactiveuser().subscribe(resData => {
      if (resData.status === true) {
        this.inactiveuser = resData.data.inactiveuser;
      } else {
        this.inactiveuser = 0;
      }
    });
    this.coinservice.totalblockuser().subscribe(resData => {
      if (resData.status === true) {
        this.blockuser = resData.data.blockuser;
      } else {
        this.blockuser = 0;
      }
    });
    this.coinservice.gettotalcoin().subscribe(resData => {
      if (resData.status === true) {
        this.totalcoin = resData.data.totalcoin;
      } else {
        this.totalcoin = 0;
      }
    });
    this.coinservice.getnewcoin().subscribe(resData => {
      if (resData.status === true) {
        this.newcoin = resData.data.newcoin;
      } else {
        this.newcoin = 0;
      }
    });
    this.coinservice.getactivecoin().subscribe(resData => {
      if (resData.status === true) {
        this.activecoin = resData.data.activecoin;
      } else {
        this.activecoin = 0;
      }
    });
    this.coinservice.getinactivecoin().subscribe(resData => {
      if (resData.status === true) {
        this.inactivecoin = resData.data.inactivecoin;
      } else {
        this.inactivecoin = 0;
      }
    });
  }
}
