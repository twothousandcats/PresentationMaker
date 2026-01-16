import style from './ColorPicker.module.css';
import React, { useRef } from 'react';
import { concatClassNames } from '../../store/utils/functions.ts';

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const triggerClasses = concatClassNames([style.trigger]);

  return (
    <div className={style.holder}>
      <div
        className={triggerClasses}
        onClick={handleClick}
        style={{
          backgroundColor: value,
        }}
      />
      <input
        className={style.input}
        ref={inputRef}
        type="color"
        value={value}
        onChange={handleChange}
        aria-hidden="true"
      />
    </div>
  );
};
