interface errType {
  source: string,                   // 源代码路径
  column: number,                   // 源代码列数
  line: number,                     // 源代码行数
  type: string,                     // 错误类型
  error: string,                    // 错误具体信息
  filename: string,                 // 打包之后的文件名
  path: string,                     // 打包之后的文件路径
  userAgent: string,                // 具体浏览器信息
  datetime: string,                 // 错误发生时间
}

let a = {
  result: { ok: 1, n: 1 },
  ops: [{
    email: 'asd@we.com',
    username: 'www',
    password: 'www',
    projects: [],
    _id: '59bbbe1f4d27b63bd91ac03d'
  }],
  insertedCount: 1,
  insertedIds: ['59bbbe1f4d27b63bd91ac03d']
}
