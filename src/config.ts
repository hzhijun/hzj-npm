import { IResponse } from 'mkb';
import { RequestOptionsInit } from 'umi-request';

interface IConfig {
  // 网络框架用到的参数
  request?: {
    // 响应之后，这儿业务中可自定义处理 Response
    onResponseCallback?: (response?: any, url?: string, options?: RequestOptionsInit) => IResponse;
    // 控制全局 loading 是否加载
    onLoadingCallback?: (url?: string, options?: RequestOptionsInit) => boolean;

    loadingType?: 'line-scale' | 'antd-spin';
  };
}

export let config: IConfig = {};

export default function defineConfig(cfg: IConfig): void {
  config = { ...config, ...cfg };
}
