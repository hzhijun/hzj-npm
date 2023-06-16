import {
  extend,
  RequestInterceptor,
  RequestMethod,
  RequestOptionsInit,
  ResponseError,
  ResponseInterceptor,
} from 'umi-request';

import { config } from '@/config';
import { notification } from 'antd';

import fullScreenLoading from './loading';

// 定义网络请求状态对应描述
const statusMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function loadingAllowShow(url: string, options: RequestOptionsInit, isShow: boolean) {
  // 单次请求是否显示 loading
  if (options?.showLoading === false) return;

  // 全局控制是否显示 loading
  const onLoadingCallback = config?.request?.onLoadingCallback;
  if (onLoadingCallback != null && !onLoadingCallback(url, options)) return;

  // isShow，请求开始=true，请求结束=false
  isShow ? fullScreenLoading.show() : fullScreenLoading.hide();
}

// 默认的请求拦截器
const defRequestInterceptor = function (
  url: string,
  options: RequestOptionsInit,
): {
  url?: string;
  options?: RequestOptionsInit;
} {
  loadingAllowShow(url, options, true);
  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = window.location.origin + url;
  }

  return {
    url: url,
    options: { ...options, params: jsonData(options.params), data: jsonData(options.data) },
  };
};

// 默认的响应拦截器
const defResponseInterceptor = async function (
  response: Response,
  options: RequestOptionsInit,
): Promise<Response> {
  loadingAllowShow(response.url, options, false);
  return response;
};

// 默认请求失败处理
const defErrorHandler = function (error: ResponseError): void {
  const { response } = error;

  loadingAllowShow(error?.request?.url, error?.request?.options, false);

  if (response && response.status) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const errorText = statusMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${errorText}`,
      description: url,
      duration: 3,
    });
  }

  if (!response) {
    notification.error({
      description: '无法连接服务器',
      message: '网络异常',
    });
  }

  throw error;
};

// 处理请求时 key=[1,2,3]，被默认处理成 key=1&key=2&key=3 的情况，兼容服务端 c.GetAllInputParams
function jsonData(data: any): any {
  if (!data) data;
  for (const key in data) {
    if (data[key] instanceof Array) {
      Object.defineProperty(data, key, {
        value: JSON.stringify(data[key]),
        configurable: true,
      });
    }
  }

  return data;
}

const requestInterceptors: RequestInterceptor[] = [defRequestInterceptor];
const responseInterceptors: ResponseInterceptor[] = [defResponseInterceptor];

let requestMethodInstance: RequestMethod;

function requestMethod(): RequestMethod {
  if (requestMethodInstance) {
    return requestMethodInstance;
  }
  // 添加错误处理
  requestMethodInstance = extend({
    errorHandler: defErrorHandler,
  });
  // 添加自定义拦截器
  requestInterceptors.map((ri: RequestInterceptor) => {
    requestMethodInstance.interceptors.request.use(ri);
  });
  responseInterceptors.map((ri: ResponseInterceptor) => {
    requestMethodInstance.interceptors.response.use(ri);
  });

  return requestMethodInstance;
}

export default requestMethod();
