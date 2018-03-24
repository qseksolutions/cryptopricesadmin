import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css'],
  providers: [CoinService],
})
export class AdvertiseComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  advertise: any;
  allcategory: any;
  category: any;
  aid: any = 0;

  add = {
    add_id: '',
    catid: '',
    deafult: '',
    custom: ''
  };


  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.advertiselist().subscribe(resData => {
      if (resData.status === true) {
        this.advertise = resData.data;
        setTimeout(() => {
          $('#addlist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
    this.coinservice.advertiseplacelist().subscribe(resData => {
      if (resData.status === true) {
        this.allcategory = resData.data;
      }
    });
  }

  addadvertise() {
    this.aid = 0;
    $('#add_id').val('');
    $('#catid').val('');
    $('#deafult').val('');
    $('#custom').val('');
    $('#addadvertisemodal').modal('toggle');
  }

  addcategory() {
    $('#addcategorymodal').modal('toggle');
  }

  onSubmitaddPlace() {
    console.log(this.category);
    if (this.category === '' || this.category === undefined) {
      this.toasterService.pop('error', 'Error', 'Please enter advertise place');
    } else {
      this.coinservice.addnewadvertiseplace(this.category).subscribe(resData => {
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          setTimeout(() => {
            location.reload();
          }, 100);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  onSubmitaddAdvertise() {
    console.log(this.add);
    this.add.add_id = $('#add_id').val();
    this.add.catid = $('#catid').val();
    this.add.deafult = $('#deafult').val();
    this.add.custom = $('#custom').val();
    if (this.add.catid === '') {
      this.toasterService.pop('error', 'Error', 'Please select category');
    } else {
      this.coinservice.addupdatenewadvertise(this.add).subscribe(resData => {
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          $('#addlist').DataTable().destroy();
          this.ngOnInit();
          setTimeout(() => {
            $('#addadvertisemodal').modal('toggle');
            //  location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  updateadvertise(id) {
    this.coinservice.getadvertiseupdatedata(id).subscribe(resData => {
      if (resData.status === true) {
        this.aid = resData.data.id;
        $('#add_id').val(resData.data.id);
        $('#catid').val(resData.data.aid);
        $('#deafult').val(resData.data.default_ad);
        $('#custom').val(resData.data.custom_ad);
        $('#addadvertisemodal').modal('toggle');
      } else {
      }
    });
  }

  deleteadvertise(id) {
    this.coinservice.deleteadvertisedata(id).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#addlist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }
}
