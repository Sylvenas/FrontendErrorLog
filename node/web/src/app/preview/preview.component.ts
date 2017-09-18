import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreviewService } from '../services/preview/preview.service';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  private imgs: Array<string> = ['https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?dpr=1&auto=compress,format&fit=max&w=376&q=80&cs=tinysrgb&crop=',
    'https://images.unsplash.com/photo-1452696024259-cb7474e79947?dpr=1&auto=compress,format&fit=max&w=376&q=80&cs=tinysrgb&crop=',
    'https://images.unsplash.com/photo-1416163026265-0bc340a710e4?dpr=1&auto=compress,format&fit=max&w=376&q=80&cs=tinysrgb&crop=',
    'https://images.unsplash.com/43/unsplash_522b9cc0386f1_1.jpg?dpr=1&auto=compress,format&fit=crop&w=300&h=80&q=80&cs=tinysrgb&crop=',
    'https://images.unsplash.com/photo-1414269665216-a57681e266b3?dpr=1&auto=compress,format&fit=crop&w=330&h=80&q=80&cs=tinysrgb&crop=',
    'https://images.unsplash.com/photo-1505567745926-ba89000d255a?dpr=1&auto=compress,format&fit=crop&w=332&h=80&q=80&cs=tinysrgb&crop='
  ];

  private isShowNewForm: boolean = false;
  private isHavePro: boolean = false;
  private collections: Array<{}> = [];
  private username: string = '';

  private newProjectForm: FormGroup;

  constructor(private fb: FormBuilder, private previewService: PreviewService, private loginService: LoginService) {
    this.newProjectForm = fb.group({
      'pName': [null, Validators.required],
      'pDirector': [null, Validators.required]
    })
  }

  ngOnInit() {
    let userId = this.loginService.getUserId('islogged');
    this.getProjectsByUserId(userId)
  }

  private getProjectsByUserId(userId) {
    this.previewService.getCols({ userId }).subscribe(res => {
      this.collections = res.data.projects;
      this.username = res.data.username;
    })
  }

  private showNewFrom() {
    this.isShowNewForm = !this.isShowNewForm;
  }
  private handleNewProject(projectInfo) {
    let userId = this.loginService.getUserId('islogged');
    Object.assign(projectInfo, { updateTime: new Date().getTime() })

    let params = {
      userId,
      pInfo: projectInfo
    }
    this.previewService.newProject(params).subscribe(res => {
      if (res.status) {
        this.isShowNewForm = false;
        let userId = this.loginService.getUserId('islogged');
        this.getProjectsByUserId(userId)
      } else {
        this.isHavePro = true;
      }
    })
  }
}
