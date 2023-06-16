import React, { ReactNode } from 'react';

export interface ILoadingProp {
  /**
   * @description   动画颜色
   * @default       "#4096ff"
   */
  color?: string;

  /**
   * @description   动画元素大小
   * @default       4
   */
  size?: number;

  /**
   * @description   动画底部文本
   * @default       ""
   */
  text?: string;

  /**
   * @description   动画底部文本颜色
   * @default       ""
   */
  textColor?: string;

  /**
   * @description   动画底部文本距动画的间距
   * @default       -
   */
  textOffset?: number;

  /**
   * @description   动画可见性
   * @default       flase
   */
  visible?: boolean;

  /**
   * @description   动画容器样式
   * @default       -
   */
  style?: React.CSSProperties | undefined;

  /**
   * @description   文字样式
   * @default        -
   */
  textStyle?: React.CSSProperties | undefined;

  /**
   * @description   容器子元素
   * @default       -
   */
  children?: ReactNode;
}
