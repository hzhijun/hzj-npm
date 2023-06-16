import { Button, Drawer, Modal, Spin } from 'antd';
import { defineConfig, httpGet, IResponse } from 'mkb';
import React, { useState, type FC } from 'react';
import fullScreenLoading from '../loading';

defineConfig({
  request: {
    onResponseCallback: function (rsp: any): IResponse {
      console.log('afterResponse 走自定义回调');
      return { code: 2001, data: rsp };
    },
    //
    onLoadingCallback: function (): boolean {
      return true;
    },
  },
});

const Demo: FC = function (): JSX.Element {
  const [spinLoading, setSpinLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const hideDrawer = () => {
    setIsDrawerOpen(false);
  };

  const showSpin = () => {
    setSpinLoading(true);
    setTimeout(() => {
      setSpinLoading(false);
    }, 6000);
  };

  const showFullScreenLoading = () => {
    fullScreenLoading.show();

    setTimeout(() => {
      fullScreenLoading.hide();
    }, 6000);
  };

  async function errRequest() {
    // 随便写的 url，模拟服务器访问不通的情况
    // const url = `http://${window?.location?.hostname}:8011/api/page_log`;
    const url = `http://192.168.6.19:8001/api/start/v1/log/page_log`;
    const params = {
      key1: [1, 2, 3, 4],
      key2: '1, 2, 3, 4',
    };

    httpGet(url, params).request<{ name: string; name1: string }>({
      onOK: function (data): void {
        console.log('onOK', data);
      },
      onFail: function (rsp): void {
        console.log('onFail', rsp);
      },
    });
  }

  return (
    <div>
      <Spin spinning={spinLoading}>
        <Button type="primary" style={{ margin: 10 }} onClick={errRequest}>
          模拟异常请求
        </Button>
        <br />

        <Button type="primary" style={{ margin: 10 }} onClick={showSpin}>
          显示 Spin Loading(6s)
        </Button>
        <br />
        <Button type="primary" style={{ margin: 10 }} onClick={showFullScreenLoading}>
          显示全屏 Loading(6s)
        </Button>
        <br />
        <Button type="primary" style={{ margin: 10 }} onClick={showModal}>
          模态中显示全屏 Loading
        </Button>
        <br />
        <Button type="primary" style={{ margin: 10 }} onClick={showDrawer}>
          抽屉中显示全屏 Loading
        </Button>

        <Modal open={isModalOpen} onOk={hideModal} onCancel={hideModal}>
          <Button type="primary" onClick={showFullScreenLoading}>
            显示全屏 Loading(6s)
          </Button>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        <Drawer title="Basic Drawer" placement="right" onClose={hideDrawer} open={isDrawerOpen}>
          <Button type="primary" onClick={showFullScreenLoading}>
            显示全屏 Loading(6s)
          </Button>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </Spin>
    </div>
  );
};

export default Demo;
