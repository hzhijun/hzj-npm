# Request 网络库

## Demo 展示

<code src="./demo/index.tsx"/></code>

## 使用示例

### 异步请求(GET/POST)

```ts | pure
import { httpGet } from 'mkb';

interface IUser {
  uaerName: string;
  userID: number;
}

// GET 请求
httpGet('url').request<IUser>({
  onOK: function (data): void {
    console.log('请求成功');
  },
});

// POST 请求
httpPost('url').request<IUser>({
  onOK: function (data): void {
    console.log('请求成功');
  },
});
```

### 带参数请求(GET/POST)

```ts | pure
import { httpPost } from 'mkb';

interface IUser {
  uaerName: string;
  userID: number;
}

const param = { id: 1001 };

httpPost('url', param).request<IUser>({
  onOK: function (data): void {
    console.log('请求成功');
  },
});
```

### 接收失败回调

```ts | pure
import { httpPost } from 'mkb';

interface IUser {
  uaerName: string;
  userID: number;
}

httpPost('url').request<IUser>({
  onOK: function (data): void {
    console.log('请求成功');
  },
  onFail: function (rsp): void {
    console.log('失败');
  },
});
```

### 同步请求(GET/POST)

```ts | pure
import { httpGet } from 'mkb';

interface IUser {
  uaerName: string;
  userID: number;
}

const response = await httpPost('url').awaitRequest<IUser>();
```

### 自定义 options

```ts | pure
import { httpGet } from 'mkb';

interface IUser {
  uaerName: string;
  userID: number;
}

httpPost('url', param)
  .setOptions({ timeout: 3000 }) // 修改请求超时时间
  .request<IUser>({
    onOK: function (data): void {
      console.log('请求成功');
    },
  });
```

## 参数介绍

| **属性名** |    **描述**    |      **类型**      | **默认值** |
| :--------: | :------------: | :----------------: | :--------: |
|    url     |    请求路径    |       string       |   `必传`   |
|   param    |    请求参数    |         {}         |    `-`     |
|    onOK    |  请求成功回调  |   (data)=> void    |    `-`     |
|   onFail   |  请求失败回调  | (response)=> void  |    `-`     |
| setOptions | 自定义 options | RequestOptionsInit |    `-`     |


#### RequestOptionsInit

|   **属性名**   |   **描述**   | **类型**  | **默认值** |
|:-----------:|:----------:|:-------:|:-------:|
| showLoading | 显示 loading | boolean | `true`  |
| showMessage |   显示错误提示   | boolean | `true`  |


