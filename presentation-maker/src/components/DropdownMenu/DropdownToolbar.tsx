import { type ReactNode, useEffect, useRef, useState } from 'react';
import style from './DropdownToolbar.module.css';
import IconButton from '../IconButton/IconButton.tsx';
import * as React from 'react';

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
  const dropdownRef = useRef<HTMLLIElement>(null);

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

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <li
      className={style.dropdown}
      onClick={handleTriggerClick}
      ref={dropdownRef}
    >
      <ul>
        {trigger}
      </ul>
      {isOpen && (
        <ul className={style.list}>
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
    </li>
  );
}
