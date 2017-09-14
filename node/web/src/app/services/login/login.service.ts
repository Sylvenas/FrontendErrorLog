import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private isUserLoggedIn: boolean = false;

  constructor(public http: Http) {
  }

  public login(userInfo) {
    return this.http.post('/api/login', userInfo).map(res => res.json())
  }

  public getUserLoggedIn(): boolean {
    if (this.getCookie('islogged')) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }
    return this.isUserLoggedIn;
  }

  private getCookie(name): string {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
    if (arr = document.cookie.match(reg)) {
      return encodeURI(arr[2]);
    }
    else {
      return '';
    }
  }

}
