import React, { type FC } from 'react';
import './style';
import { ILoadingProp } from './type';

const LineScale: FC<ILoadingProp> = function (props): JSX.Element {
  const { text, style, textStyle, color, textColor, size = 4, textOffset } = props;

  return (
    <div className="pt-loader-wrap" style={style}>
      <div className="pt-line-scale">
        <div
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 9}px`,
          }}
        ></div>
        <div
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 9}px`,
          }}
        ></div>
        <div
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 9}px`,
          }}
        ></div>
        <div
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 9}px`,
          }}
        ></div>
        <div
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 9}px`,
          }}
        ></div>
      </div>
      {!!text && (
        <div
          className="pt-loader-text-tip"
          style={{ marginTop: `${textOffset}px`, color: textColor, ...textStyle }}
        >
          {text}
        </div>
      )}
      {props.children}
    </div>
  );
};

export default LineScale;
