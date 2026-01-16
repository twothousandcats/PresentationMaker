import style from './FontSelector.module.css';
import { useState, useRef, useEffect } from 'react';
import { STANDARD_FONTS } from '../../store/utils/config.ts';

type FontSelectorProps = {
  value: string;
  onChange: (family: string) => void;
};

export const FontSelector = ({ value, onChange }: FontSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
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

  const handleSelect = (family: string) => {
    onChange(family);
    setIsOpen(false);
  };

  return (
    <div className={style.holder} ref={dropdownRef}>
      <div className={style.control} onClick={() => setIsOpen(!isOpen)}>
        {value ?? ''}
      </div>

      {isOpen && (
        <ul className={style.list}>
          {STANDARD_FONTS.map((family) => (
            <li
              className={style.listItem}
              key={family}
              onClick={() => handleSelect(family)}
            >
              {family}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
