import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CoinService],
})
export class LoginComponent implements OnInit {

  private toasterService: ToasterService;

  public urlString: any = myGlobals.base_url;
  public login_ses: any = myGlobals.login_ses;
  allcategory: any;
  allquestion: any;
  regex: any;
  sid: any = 0;
  public category: any;
  login = {
    email: '',
    password: '',
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (this.login_ses != null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
    $('body').addClass('bg-dark');
  }

  onSubmitLogin() {
    if (this.login.email === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.login.email.length === 0 || !this.regex.test(this.login.email)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.login.password === '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.loginuserdata(this.login).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          localStorage.setItem('login_ses', resData.status);
          localStorage.setItem('id', resData.data.id);
          localStorage.setItem('email', resData.data.email);
          localStorage.setItem('name', resData.data.name);
          localStorage.setItem('role', resData.data.role);
          localStorage.setItem('usertype', resData.data.usertype);
          localStorage.setItem('status', resData.data.status);
          localStorage.setItem('base', resData.data.d_currency);
          localStorage.setItem('user_base', resData.data.d_currency);
          localStorage.setItem('token', resData.data.token);
          setTimeout(() => {
            window.location.href = this.urlString;
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

}
