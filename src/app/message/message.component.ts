import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [CoinService],
})
export class MessageComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  allmessage: any;

  msg = {
    message_id: '',
    name: '',
    email: '',
    answer: '',
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.messagelist().subscribe(resData => {
      if (resData.status === true) {
        this.allmessage = resData.data;
        setTimeout(() => {
          $('#messagelist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
  }

  messagedelete(id) {
    this.coinservice.deletemessage(id).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#messagelist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }

  updatemessage(id) {
    this.coinservice.singlemessage(id).subscribe(resData => {
      if (resData.status === true) {
        $('#cname').html(resData.data.name);
        $('#cemail').html(resData.data.email);
        $('#csubject').html(resData.data.subject);
        $('#cmessage').html(resData.data.message);
        $('#message_id').val(resData.data.id);
        $('#name').val(resData.data.name);
        $('#email').val(resData.data.email);
        this.msg.answer = resData.data.answer;
        $('#sendmailmodal').modal('toggle');
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }

  onSubmitAnswer() {
    this.msg.message_id = $('#message_id').val();
    this.msg.name = $('#name').val();
    this.msg.email = $('#email').val();
    console.log(this.msg);
    if (this.msg.answer === '') {
      this.toasterService.pop('error', 'Required', 'Please enter answer');
    } else {
      this.coinservice.updatesinglemessage(this.msg).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          this.ngOnInit();
          $('#messagelist').DataTable().destroy();
          setTimeout(() => {
            $('#sendmailmodal').modal('toggle');
          }, 2000);
          /* setTimeout(() => {
            location.reload();
          }, 1000); */
        } else {
          this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
        }
      });
    }
  }

}
