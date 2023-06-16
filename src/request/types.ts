// 响应体数据结构
export interface IResponse<T = any> {
  code?: number;
  position?: string;
  msg?: any;
  data?: T;
}
