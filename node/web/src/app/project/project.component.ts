import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { MdPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { ProjectService } from '../services/project/project.service';

interface errType {
  proId: string,                    // 项目ID
  source: {                         // 源代码相关信息
    column: number,                 // 源代码列数
    line: number,                   // 源代码行数
    name: string,                   // 报错的名称
    source: string                   // 源代码路径
  },
  sourceFile?: string,
  linCol?: string,
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

   displayedColumns = ['fileName', 'error', 'source', 'line,column', 'userAgent', 'datetime'];
  private dataSource: any | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(private router: ActivatedRoute, private proService: ProjectService) { }

  ngOnInit() {
    this.router.paramMap
      .switchMap((params: ParamMap) => this.proService.getErrInfosByProId(params.get('id')))
      .subscribe(infos => {
        this.errInfos = infos.data.errors.map(item => {
          item.sourceFile = item.source.source;
          item.linCol = `${item.source.line},${item.source.column}`
          return item;
        });
        console.log(this.errInfos)
      });

    //this.dataSource = this.errInfos

    this.dataSource = new ExampleDataSource(this.errInfos, this.paginator);

  }

  ngOnDestroy() {

  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(private _errInfos: Array<errType>, private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<errType[]> {
    const displayDataChanges = [
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._errInfos;

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() { }
}
