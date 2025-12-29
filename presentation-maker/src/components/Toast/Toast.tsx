import { concatClassNames } from '../../store/utils/functions.ts';
import style from './Toast.module.css';
import * as React from 'react';
import type { ToastProps, ToastType } from '../../store/types/utility-types.ts';

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  type = 'saving',
  duration,
}) => {
  const toastClass = concatClassNames(
    [
      style.toast,
      style[type],
      visible && style.visible
    ]
  );

  return (
    <div className={toastClass} role="alert" aria-live="polite">
      <p className={style.message}>{message}</p>
    </div>
  );
};
