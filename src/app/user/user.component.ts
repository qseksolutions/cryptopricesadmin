import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [CoinService],
})
export class UserComponent implements OnInit {

  private toasterService: ToasterService;
  public base_url: any = myGlobals.base_url;
  allusers: any = Array();
  user = {
    user_id: '',
    name: '',
    email: '',
    status: ''
  };

  constructor(private coinservice: CoinService, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.getuserlist().subscribe(resData => {
      if (resData.status === true) {
        this.allusers = resData.data;
        setTimeout(() => {
          $('#userslist').DataTable({
            // 'pageLength': 50,
          });
        }, 2000);
      }
    });
  }

  viewuser(id) {
    this.coinservice.getuserupdatedata(id).subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        $('#name_view').html(resData.data.name);
        $('#email_view').html(resData.data.email);
        $('#currency_view').html(resData.data.d_currency);
        if (resData.data.usertype == 1) {
          $('#type_view').html('<span class="label label-primary">Cryptoprices</span>');
        } else if (resData.data.usertype == 2) {
          $('#type_view').html('<span class="label label-facebook">Facebook</span>');
        } else if (resData.data.usertype == 3) {
          $('#type_view').html('<span class="label label-google">Google</span>');
        }
        if (resData.data.status == 1) {
          $('#status_view').html('<span class="label label-success">Active</span>');
        } else if (resData.data.status == 2) {
          $('#status_view').html('<span class="label label-danger">Block</span>');
        } else if (resData.data.status == 0) {
          $('#status_view').html('<span class="label label-warning">Inactive</span>');
        }
        $('#viewusermodal').modal('toggle');
      } else {
      }
    });
  }

  updatesuser(id) {
    this.coinservice.getuserupdatedata(id).subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        $('#user_id').val(resData.data.id);
        $('#name').val(resData.data.name);
        $('#email').val(resData.data.email);
        if (resData.data.status == 1) {
          $('#status1').prop('checked',true);
        } else if (resData.data.status == 0) {
          $('#status0').prop('checked',true);
        } else {
          $('#status2').prop('checked',true);
        }
        $('#updateusermodal').modal('toggle');
      } else {
      }
    });
  }

  deleteuser(id) {
    this.coinservice.deleteuser(id).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        $('#userslist').DataTable().destroy();
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

  onSubmitUpdateUser() {
    this.user.user_id = $('#user_id').val();
    this.user.name = $('#name').val();
    this.user.email = $('#email').val();
    this.user.status = $('input[name=status]:checked').val();
    if (this.user.name === '') {
      this.toasterService.pop('error', 'Error', 'Please enter name');
    } else if (this.user.email === '') {
      this.toasterService.pop('error', 'Error', 'Please enter email');
    } else {
      this.coinservice.addupdateuser(this.user).subscribe(resData => {
        if (resData.status === true) {
          if (resData.data.affectedRows > 0) {
            this.toasterService.pop('success', 'Success', resData.message);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
          $('#userslist').DataTable().destroy();
          this.ngOnInit();
          setTimeout(() => {
            $('#updateusermodal').modal('toggle');
            //  location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

}
