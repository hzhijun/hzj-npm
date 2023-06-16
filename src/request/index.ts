import { config } from '@/config';
import { message } from 'antd';
import { RequestOptionsInit } from 'umi-request';
import request from './request';
import { IResponse } from './types';

// 请求结束回调
interface IResult<T> {
  onOK?: (data: T) => void;
  onFail?: (rsp: IResponse<T>) => void;
}

// http 请求方法枚举
enum Method {
  GET = 'GET',
  POST = 'POST',
}

enum Code {
  REQUEST_SUCCESS = 200, // 请求成功
  LOGIN_EXPIRED = 2001, // 未登录
  UNAUTHORIZED = 2002, // 未授权
  REQUEST_ERROR = 4001, // 请求错误，4xx、5xx
  UNKNOWN_ERROR = 0, // 未知的错误
}

// loadingIsDisable
interface IRequestOptionsInit extends RequestOptionsInit {
  showLoading?: boolean;
  showMessage?: boolean;
}

// 默认的 reqOptions
const defOptions: IRequestOptionsInit = {
  credentials: 'include', // 携带 session
  requestType: 'form', // from 请求
  showLoading: true,
  showMessage: true,
};

// 网络请求客户端
class HttpClient {
  private url: string;
  private reqOptions: IRequestOptionsInit = { ...defOptions };

  constructor(url: string) {
    this.url = url;
  }

  public async request<T = any>(result?: IResult<T>) {
    const onFail = result?.onFail || ((data) => data);
    const onOK = result?.onOK || ((data) => data);

    const onResponseCallback = config.request?.onResponseCallback || undefined;

    let response: IResponse = {};

    try {
      if (onResponseCallback) {
        const rsp = await request<any>(this.url, this.reqOptions);
        response = onResponseCallback(rsp, this.url, this.reqOptions);
      } else {
        response = await request<IResponse>(this.url, this.reqOptions);
      }
    } catch (error) {
      onFail({ msg: error });
      return;
    }

    if (response == null) {
      this.showErrorMessage(`获取 response 失败`);
      onFail({ msg: 'response can not bee null', code: Code.REQUEST_ERROR });
      return;
    }

    switch (response.code) {
      case Code.REQUEST_SUCCESS:
        onOK(response.data);
        return;
      case Code.UNKNOWN_ERROR || undefined:
        this.showWarnMessage('获取 code 失败');
        break;
      case Code.LOGIN_EXPIRED:
        this.showErrorMessage('登录过期，请重新登录');
        break;
      case Code.UNAUTHORIZED:
        this.showErrorMessage(`账号未授权访问接口[${this.url}]`);
        break;
      default:
        response.msg && this.showErrorMessage(response.msg);
        break;
    }

    onFail(response);
  }

  public awaitRequest<T = any>() {
    return request<T>(this.url, this.reqOptions);
  }

  public options(reqOptions: IRequestOptionsInit) {
    this.reqOptions = { ...this.reqOptions, ...reqOptions };
    return this;
  }

  private showWarnMessage(msg: string) {
    this.reqOptions.showMessage && message.warning(msg);
  }

  private showErrorMessage(msg: string) {
    this.reqOptions.showMessage && message.error(msg);
  }
}

export const httpPost = function (url: string, param?: object): HttpClient {
  return new HttpClient(url).options({ data: param, method: Method.POST });
};

export const httpGet = function (url: string, param?: object): HttpClient {
  return new HttpClient(url).options({ params: param, method: Method.GET });
};
