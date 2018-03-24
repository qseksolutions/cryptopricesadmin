import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.css'],
  providers: [CoinService],
})
export class SeoComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  public live_url: any = myGlobals.live_url;
  public test_url: any = myGlobals.test_url;
  allseo: any;
  sid: any = 0;

  seo = {
    seo_id: '',
    url: this.live_url,
    test_url: this.test_url,
    title: '',
    keywords: '',
    description: '',
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.seolist().subscribe(resData => {
      if (resData.status === true) {
        this.allseo = resData.data;
        setTimeout(() => {
          $('#seolist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
  }

  addseometa() {
    this.sid = '';
    this.seo.seo_id = '';
    this.seo.url = this.live_url;
    this.seo.test_url = this.test_url;
    this.seo.title = '';
    this.seo.keywords = '';
    this.seo.description = '';
    $('#addseometamodal').modal('toggle');
  }

  updateseometa(id) {
    this.coinservice.getseoupdatedata(id).subscribe(resData => {
      console.log(resData);
      if (resData.status === true) {
        this.sid = resData.data.id;
        this.seo.seo_id = resData.data.id;
        this.seo.url = resData.data.url;
        this.seo.test_url = resData.data.test_url;
        this.seo.title = resData.data.title;
        this.seo.keywords = resData.data.keywords;
        this.seo.description = resData.data.description;
        $('#addseometamodal').modal('toggle');
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

  onSubmitaddSeoMeta() {
    console.log(this.seo);
    this.seo.seo_id = $('#seo_id').val();
    this.seo.url = $('#url').val();
    this.seo.test_url = $('#test_url').val();
    this.seo.title = $('#title').val();
    this.seo.keywords = $('#keywords').val();
    this.seo.description = $('#description').val();
    if (this.seo.url === '') {
      this.toasterService.pop('error', 'Error', 'Please select url');
    } else if (this.seo.test_url === '') {
      this.toasterService.pop('error', 'Error', 'Please enter test url');
    } else if (this.seo.title === '') {
      this.toasterService.pop('error', 'Error', 'Please enter title');
    } else if (this.seo.keywords === '') {
      this.toasterService.pop('error', 'Error', 'Please enter keyword');
    } else if (this.seo.description === '') {
      this.toasterService.pop('error', 'Error', 'Please enter description');
    } else {
      this.coinservice.addupdateseodata(this.seo).subscribe(resData => {
        console.log(resData);
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          $('#seolist').DataTable().destroy();
          this.ngOnInit();
          setTimeout(() => {
            $('#addseometamodal').modal('toggle');
            //  location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  seometadelete(id) {
    this.coinservice.deleteseometa(id).subscribe(resData => {
      console.log(resData);
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#seolist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

}
