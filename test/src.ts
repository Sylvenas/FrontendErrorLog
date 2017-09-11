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