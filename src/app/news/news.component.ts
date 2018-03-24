import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [CoinService],
})
export class NewsComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  allcategory: any;
  allnews: any;
  nid: any = 0;
  public category: any;
  news = {
    news_id: '',
    title: '',
    source: '',
    short_news: '',
    long_news: '',
    status: ''
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.newslist().subscribe(resData => {
      if (resData.status === true) {
        this.allnews = resData.data;
        setTimeout(() => {
          $('#newslist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
  }

  addnews() {
    this.nid = 0;
    $('#news_id').val('');
    $('#title').val('');
    $('#source').val('');
    $('#short_news').val('');
    $('input[name=status]').prop('checked',false);
    this.news.long_news = '';
    $('#addupdatenewsmodal').modal('toggle');
  }

  onSubmitaddupdateNews() {
    this.news.news_id = $('#news_id').val();
    this.news.title = $('#title').val();
    this.news.source = $('#source').val();
    this.news.short_news = $('#short_news').val();
    this.news.status = $('input[name=status]:checked').val();
    console.log(this.news);
    if (this.news.title === '') {
      this.toasterService.pop('error', 'Error', 'Please enter title');
    } else if (this.news.source === '') {
      this.toasterService.pop('error', 'Error', 'Please enter source');
    } else if (this.news.short_news === '') {
      this.toasterService.pop('error', 'Error', 'Please enter short news');
    } else if (this.news.long_news === '') {
      this.toasterService.pop('error', 'Error', 'Please enter long news');
    } else if (this.news.status === '') {
      this.toasterService.pop('error', 'Error', 'Please select status');
    } else {
      this.coinservice.addupdatenews(this.news).subscribe(resData => {
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          $('#newslist').DataTable().destroy();
          this.ngOnInit();
          setTimeout(() => {
            $('#addupdatenewsmodal').modal('toggle');
            //  location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  updatenews(id) {
    this.coinservice.newsupdatedata(id).subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.nid = resData.data.id;
        $('#news_id').val(resData.data.id);
        $('#title').val(resData.data.title);
        $('#source').val(resData.data.source);
        $('#short_news').val(resData.data.short_news);
        this.news.long_news = resData.data.long_news;
        if (resData.data.status == 1) {
          $('#status1').prop('checked', true);
        } else if (resData.data.status == 0) {
          $('#status0').prop('checked', true);
        }
        $('#addupdatenewsmodal').modal('toggle');
      } else {
      }
    });
  }

  deletenews(id) {
    this.coinservice.deletenews(id).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#newslist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

}
