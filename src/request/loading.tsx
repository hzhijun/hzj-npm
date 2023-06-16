import { config } from '@/config';
import { Spin } from 'antd';
import { LineScale } from 'mkb';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style';

let loadingStatus = false;

let fullScreenLoading: FullScreenLoading;

class FullScreenLoading {
  private loadingRequestCount = 0;
  private globalLoadingDom: HTMLElement | null = null;

  // 显示全局 loading 组件
  public show() {
    if (this.loadingRequestCount == 0) {
      this.startLoading();
    }
    this.loadingRequestCount++;
  }

  // 隐藏全局 loading 组件
  public hide() {
    if (this.loadingRequestCount <= 0) return;
    this.loadingRequestCount--;
    if (this.loadingRequestCount == 0) {
      this.stopLoading();
    }
  }

  // 开始加载
  private async startLoading() {
    loadingStatus = true;
    const bodyStyle = document.body.style;
    bodyStyle.overflowY = 'hidden';
    bodyStyle.overflowX = 'hidden';

    this.globalLoadingDom = document.createElement('div');
    document.body.appendChild(this.globalLoadingDom);

    const modal = ReactDOM.createRoot(this.globalLoadingDom as HTMLElement);
    modal.render(this.render());
  }

  // 结束加载
  private async stopLoading() {
    loadingStatus = false;
    if (this.globalLoadingDom == null) return;
    document.body.removeChild(this.globalLoadingDom);
    const bodyStyle = document.body.style;
    bodyStyle.overflowY = '';
    bodyStyle.overflowX = '';
    bodyStyle.width = '';
  }

  // 全局 loading 组件
  private render(): JSX.Element {
    return <LoadingView />;
  }
}

// 全局 loading 组件
function LoadingView(): JSX.Element {
  const [spend, setSpend] = useState(0);

  function sleep(millisecond: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, millisecond);
    });
  }

  async function addSpend(spend: number) {
    if (loadingStatus == false) return;
    setSpend(spend);
    await sleep(2000);
    addSpend(spend + 2);
  }

  useEffect(function (): void {
    addSpend(1);
  }, []);

  function spendText(): string {
    return (spend > 2 && spend + '') || '';
  }

  function View(): JSX.Element {
    switch (config?.request?.loadingType) {
      case 'line-scale':
        return (
          <LineScale
            size={3}
            text={(spend > 2 && spend + '') || ''}
            visible={true}
            textStyle={{ fontWeight: 'bold', fontSize: '16px' }}
          />
        );
    }

    return (
      <div className="pt-spin-wrap">
        <Spin
          spinning={true}
          tip={
            <div className="pt-spin-text-tip" style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {spendText()}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="pt-modal-root">
      <div className="pt-modal-mask">
        <View />
      </div>
    </div>
  );
}

const getFullScreenLoading = function (): FullScreenLoading {
  if (fullScreenLoading == null) {
    fullScreenLoading = new FullScreenLoading();
  }
  return fullScreenLoading;
};

export default getFullScreenLoading();
