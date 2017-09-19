import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ProjectService } from '../services/project/project.service';

interface errType {
  proId: string,                    // 项目ID
  source: {                         // 源代码相关信息
    column: number,                 // 源代码列数
    line: number,                   // 源代码行数
    name: string,                   // 报错的名称
    source: string                  // 源代码路径
  },
  column: number,                   // 编译之后代码列数
  line: number,                     // 编译之后代码行数
  type: string,                     // 错误类型
  error: string,                    // 错误具体信息
  filename: string,                 // 打包之后的文件名
  path: string,                     // 打包之后的文件路径
  userAgent: string,                // 具体浏览器信息
  stackTrace: string,               // 调用堆栈
  datetime: string,                 // 错误发生时间
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit, OnDestroy {

  private proId: string = '';
  private errInfos: Array<errType> = [];

  constructor(private router: ActivatedRoute, private proService: ProjectService) { }

  ngOnInit() {
    this.router.paramMap
      .switchMap((params: ParamMap) => this.proService.getErrInfosByProId(params.get('id')))
      .subscribe(infos => {
        this.errInfos = infos.data.errors;
        console.log(this.errInfos)
      });
  }

  ngOnDestroy() {

  }
}
