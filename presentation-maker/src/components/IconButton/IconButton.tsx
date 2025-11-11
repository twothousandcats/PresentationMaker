import style from './IconButton.module.css';
import { type ReactNode, useState } from 'react';
import { concatModifiersByFlag } from '../../store/utils/functions.ts';

interface IconButtonProps {
  icon: ReactNode;
  onClickFn: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  isActive?: boolean;
}

export default function IconButton({
  icon,
  onClickFn,
  ariaLabel,
  disabled = false,
  isActive = false,
}: IconButtonProps) {
  const [isShowTooltip, setShowTooltip] = useState(false);

  const classNames = concatModifiersByFlag([
    style.toolbar__item,
    isActive ? style.toolbar__item_active : '',
    disabled ? style.toolbar__item_disabled : '',
  ]);

  const handleClick = () => {
    if (!disabled) {
      onClickFn();
    }
  };

  return (
    <li
      className={classNames}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onMouseEnter={() => !disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {icon}
      <span
        className={`${style.toolbar__hint} ${
          isShowTooltip ? style.toolbar__hint_show : ''
        }`}
      >
        {ariaLabel}
      </span>
    </li>
  );
}
