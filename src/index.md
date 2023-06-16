# 使用文档

## 环境准备

确保正确安装 [Node.js](https://nodejs.org/en/) 且版本为 14+ 即可。

```
$ node -v
v14.19.1
```

## 拉取插件

```
yarn add mkb --registry=https://rjoy-npm.pkg.coding.net/plattech-npm/mkb/
```

## 全局配置

> 在项目的入口文件处配置

```ts | pure
import { defineConfig } from 'mkb';

defineConfig({})
```

## IConfig 参数介绍

### request
|      **属性名**       |    **描述**     |                                  **类型**                                   |   **默认值**   |
|:------------------:|:-------------:|:-------------------------------------------------------------------------:|:-----------:|
| onResponseCallback |    请求响应回调     | (response?: any, url?: string, options?: RequestOptionsInit) => IResponse |     `-`     |
| onLoadingCallback  | 全局 loading 回调 |          (url?: string, options?: RequestOptionsInit) => boolean          |     `-`     |
|    loadingType     | 全局 lodaing 样式 |                       `'line-scale'  'antd-spin' `                        | `antd-spin` |
