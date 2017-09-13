import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(public http: Http) { }

  login(userInfo) {
    return this.http.post('/login', userInfo).map(res => res.json())
  }
}
