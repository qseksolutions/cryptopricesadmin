import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [CoinService],
})
export class UpdateComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  public urlString: any = myGlobals.base_url;
  coinid: any;
  coindata: any;

  coin = {
    rank: '',
    id: '',
    name: '',
    symbol: '',
    price: ''
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    /* this.coinid = window.location.href;
    this.coinid = this.coinid.split('/');
    if (this.coinid[4] === '') {
      location.href = this.urlString;
    } else {
      this.coinservice.getcoinupdatedata(this.coinid[4]).subscribe(resData => {
        if (resData.status === true) {
          console.log(resData);
          this.coindata = resData.data;
          this.toasterService.pop('success', 'Success', resData.message);
          // location.reload();
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    } */
  }

  /* onSubmitUpdateCoin() {
    console.log(this.coin);
    /* if (this.coin.rank === '') {
      this.toasterService.pop('error', 'Error', 'Please enter rank');
    } else if (this.coin.id === '') {
      this.toasterService.pop('error', 'Error', 'Please enter coin id');
    } else if (this.coin.name === '') {
      this.toasterService.pop('error', 'Error', 'Please enter coin name');
    } else if (this.coin.symbol === '') {
      this.toasterService.pop('error', 'Error', 'Please enter coin symbol');
    } else if (this.coin.price === '') {
      this.toasterService.pop('error', 'Error', 'Please enter coin price');
    } else {
      this.coinservice.updatecoindata(this.coin).subscribe(resData => {
        if (resData.status === true) {
        } else {
        }
      });
    }
  } */

  isImage(src) {
    const deferred = defer();
    const image = new Image();
    image.onerror = function () {
      deferred.resolve(false);
    };
    image.onload = function () {
      deferred.resolve(true);
    };
    image.src = src;
    return deferred.promise;
  }

  errorHandler(event, name) {
    const imgurl = 'assets/currency-190/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-190/not-found-190.png';
      }
    });
  }
}
