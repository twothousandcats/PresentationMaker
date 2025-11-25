import style from './AppRoot.module.css';
import * as React from 'react';

type RootProps = {
  children: React.ReactNode;
};

export const AppRoot = ({ children }: RootProps) => {
  return <div className={style.root}>{children}</div>;
};
