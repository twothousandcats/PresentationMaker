import style from './FontSizeControl.module.css';
import { FONT_SIZES } from '../../store/utils/config.ts';
import { concatClassNames } from '../../store/utils/functions.ts';
import { useEffect, useRef, useState } from 'react';
import IconPlus from '../Icons/IconPlus.tsx';
import IconRemove from '../Icons/IconRemove.tsx';

type FontSizeControlProps = {
  value: number;
  onChange: (newSize: number) => void;
  sizes?: number[];
};

export const FontSizeControl = ({
  value,
  onChange,
  sizes = FONT_SIZES,
}: FontSizeControlProps) => {
  const isMixed = value === 0;
  const currentIndex = isMixed ? -1 : sizes.indexOf(value);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDecrement = () => {
    if (isMixed) return;
    const nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      onChange(sizes[nextIndex]);
    }
  };

  const handleIncrement = () => {
    if (isMixed) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < sizes.length) {
      onChange(sizes[nextIndex]);
    }
  };

  const handleSelect = (size: number) => {
    onChange(size);
    setIsOpen(false);
  };

  const canDecrement = !isMixed && currentIndex > 0;
  const canIncrement =
    !isMixed && currentIndex >= 0 && currentIndex < sizes.length - 1;
  const incrementBtnClasses = concatClassNames([
    style.button,
    canIncrement && style.button_active,
  ]);
  const decrementBtnClasses = concatClassNames([
    style.button,
    canDecrement && style.button_active,
  ]);

  const displayValue = isMixed ? '' : `${value}px`;

  return (
    <div className={style.control} ref={dropdownRef}>
      <button
        className={decrementBtnClasses}
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-disabled={!canDecrement}
      >
        <IconRemove />
      </button>

      <div className={style.holder}>
        <button
          type="button"
          className={style.selectTrigger}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {displayValue}
        </button>

        {isOpen && (
          <ul className={style.dropdownList} role="listbox">
            {isMixed && (
              <li
                className={style.dropdownItem}
                onClick={() => onChange(0)}
                role="option"
              ></li>
            )}
            {sizes.map((size) => (
              <li
                key={size}
                className={concatClassNames([
                  style.dropdownItem,
                  value === size && style.dropdownItem_active,
                ])}
                onClick={() => handleSelect(size)}
                role="option"
                aria-selected={value === size}
              >
                {size}px
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className={incrementBtnClasses}
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-disabled={!canIncrement}
      >
        <IconPlus />
      </button>
    </div>
  );
};
