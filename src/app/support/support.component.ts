import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  providers: [CoinService],
})
export class SupportComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  allcategory: any;
  allquestion: any;
  sid: any = 0;
  public category: any;
  qus = {
    support_id: '',
    catid: '',
    question: '',
    answer: ''
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {

    this.coinservice.questionlist().subscribe(resData => {
      if (resData.status === true) {
        this.allquestion = resData.data;
        setTimeout(() => {
          $('#supportlist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
    this.coinservice.categorylist().subscribe(resData => {
      if (resData.status === true) {
        this.allcategory = resData.data;
      }
    });
  }

  addquestion() {
    this.sid = 0;
    $('#support_id').val('');
    $('#catid').val('');
    $('#question').val('');
    this.qus.answer = '';
    $('#addquestionmodal').modal('toggle');
  }

  addcategory() {
    $('#addcategorymodal').modal('toggle');
  }

  onSubmitaddCategory() {
    if (this.category === '') {
      this.toasterService.pop('error', 'Error', 'Please enter category');
    } else {
      this.coinservice.addnewcategory(this.category).subscribe(resData => {
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

  onSubmitaddQuestion() {
    console.log(this.qus);
    this.qus.support_id = $('#support_id').val();
    this.qus.catid = $('#catid').val();
    this.qus.question = $('#question').val();
    if (this.qus.catid === '') {
      this.toasterService.pop('error', 'Error', 'Please select category');
    } else if (this.qus.question === '') {
      this.toasterService.pop('error', 'Error', 'Please enter question');
    } else if (this.qus.answer === '') {
      this.toasterService.pop('error', 'Error', 'Please enter answer');
    } else {
      this.coinservice.addupdatenewquestion(this.qus).subscribe(resData => {
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          $('#supportlist').DataTable().destroy();
          this.ngOnInit();
          setTimeout(() => {
              $('#addquestionmodal').modal('toggle');
          //  location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  updatesupport(id) {
    this.coinservice.supportupdatedata(id).subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.sid = resData.data.id;
        $('#support_id').val(resData.data.id);
        $('#catid').val(resData.data.category_id);
        $('#question').val(resData.data.question);
        this.qus.answer = resData.data.answer;
        $('#addquestionmodal').modal('toggle');
      } else {
      }
    });
  }

  deletesupport(id) {
    this.coinservice.deletesupportdata(id).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#supportlist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

}
