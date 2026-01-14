import React from 'react';
import style from './RectangleElement.module.css';
import type { Background } from '../../store/types/types.ts';

type RectangleElementProps = {
  background: Background;
};

export const RectangleElement: React.FC<RectangleElementProps> = ({
  background,
}) => {
  return (
    <div
      className={style.image}
      style={{
        ...(background?.type === 'image' &&
          background.data && {
            backgroundImage: `url(${background.data})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }),
        ...(background?.type === 'solid' &&
          background.color && {
            backgroundColor: background.color,
          }),
      }}
    />
  );
};
