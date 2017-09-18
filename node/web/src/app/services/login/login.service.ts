import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private isUserLoggedIn: boolean = false;

  constructor(private http: Http) {
  }

  public login(userInfo) {
    return this.http.post('/api/login', userInfo).map(res => res.json())
  }

  public getUserLoggedIn(): boolean {
    if (this.getUserId('islogged')) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }
    return this.isUserLoggedIn;
  }
  public getUserId(name): string {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return encodeURI(arr[2]);
    }
    else {
      return '';
    }
  }

}
