import { type ReactNode, useEffect, useRef, useState } from 'react';
import style from './DropdownToolbar.module.css';
import IconButton from '../IconButton/IconButton.tsx';

type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
};

type DropdownMenuProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

export default function DropdownToolbar({
  trigger,
  items,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className={style.dropdown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={dropdownRef}
    >
      <div className={style.trigger}>{trigger}</div>
      {isOpen && (
        <ul>
          {items.map((btn, index) => (
            <IconButton
              key={index}
              icon={btn.icon}
              onClickFn={btn.onClick}
              ariaLabel={btn.label}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
