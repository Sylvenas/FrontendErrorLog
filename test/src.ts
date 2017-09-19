interface errType {
  proId:string,                     // 项目ID
  source: string,                   // 源代码路径
  column: number,                   // 源代码列数
  line: number,                     // 源代码行数
  type: string,                     // 错误类型
  error: string,                    // 错误具体信息
  filename: string,                 // 打包之后的文件名
  path: string,                     // 打包之后的文件路径
  userAgent: string,                // 具体浏览器信息
  stackTrace: string,               // 调用堆栈
  datetime: string,                 // 错误发生时间
}

let err: errType = {
  proId:'5f3b31ac-4433-40a1-bd24-0e88c6d4f78f',
  source: '1',
  column: 2,
  line: 3,
  type: '4',
  error: '5',
  filename: '6',
  path: '7',
  userAgent: '8',
  stackTrace: '9',
  datetime: '10',
}