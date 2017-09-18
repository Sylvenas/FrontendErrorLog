import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PreviewService {

  constructor(private http: Http) { }

  public newProject(proInfo) {
    return this.http.post('/api/newProject', proInfo).map(res => res.json())
  }

  public getCols(userId) {
    return this.http.post('/api/getProjectsByUserId', userId).map(res => res.json());
  }
}
