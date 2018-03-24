import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css'],
  providers: [CoinService],
})
export class CoinComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  public urlString: any = myGlobals.base_url;
  allcoin: any;

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.getallcoin().subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
        setTimeout(() => {
          $('#coinlist').DataTable({
            'pageLength': 50,
          });
        }, 2000);
      }
    });
  }

  updatestatus(coinid) {
    this.coinservice.updatecoindata(coinid).subscribe(resData => {
      if (resData.data.affectedRows > 0) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#coinlist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime!');
      }
    });
  }

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
    const imgurl = 'assets/currency-25/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-25/not-found-25.png';
      }
    });
  }
}
