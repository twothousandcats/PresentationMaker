import style from './AddBgDialog.module.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Modal } from '../Modal/Modal.tsx';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { ModalButton } from '../ModalButton/ModalButton.tsx';
import type { Background, Color } from '../../store/types/types.ts';
import IconButton from '../IconButton/IconButton.tsx';
import IconBrush from '../Icons/IconBrush.tsx';
import IconAddImage from '../Icons/IconAddImage.tsx';
import * as React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (background: Background) => void;
}

const TABS = [
  {
    type: 'image' as const,
    icon: <IconAddImage />,
    ariaLabel: LANGUAGES.dialogImageTab,
  },
  {
    type: 'color' as const,
    icon: <IconBrush />,
    ariaLabel: LANGUAGES.dialogColorTab,
  },
];

export function AddBgDialog({ isOpen, onClose, onAdd }: DialogProps) {
  const [content, setContent] = useState(''); // image
  const [currentColor, setCurrentColor] = useState('#000000');
  const [type, setType] = useState<'image' | 'color'>('image');
  const inputRef = useRef<HTMLInputElement>(null);

  const title =
    type === 'image'
      ? LANGUAGES.imageDialogHeading
      : LANGUAGES.colorDialogHeading;

  const changeBgType = (newType: 'image' | 'color') => {
    setType(newType);
  };

  const handleSubmit = useCallback(() => {
    if (type === 'image') {
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        onClose();
        return;
      }
      onAdd({ type: 'image', data: trimmedContent });
    } else {
      onAdd({ type: 'solid', color: currentColor as Color });
    }
  }, [content, type, onClose, onAdd, currentColor]);

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      handleSubmit();
    }
  };

  // Управление фокусом и сбросом содержимого при открытии
  useEffect(() => {
    if (isOpen) {
      setType('image');
      setContent('');
      // setCurrentColor('#000000');

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={style.holder}>
        <ul className={style.tabs}>
          {TABS.map((tab) => (
            <IconButton
              key={tab.type}
              icon={tab.icon}
              onClickFn={() => changeBgType(tab.type)}
              ariaLabel={tab.ariaLabel}
              isActive={type === tab.type}
            />
          ))}
        </ul>

        {type === 'image' ? (
          <div className={style.holder_image}>
            <input
              ref={inputRef}
              className={style.field}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : (
          <div className={style.holder_color}>
            <input
              ref={inputRef}
              type="color"
              className={style.toolbar__colorpicker}
              value={currentColor}
              onChange={(e) => {
                // setContent(e.target.value);
                setCurrentColor(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <div className={style.holder__btns}>
          <ModalButton fn={handleSubmit} placeHolder={LANGUAGES.dialogSubmit} />
          <ModalButton fn={onClose} placeHolder={LANGUAGES.dialogCancel} />
        </div>
      </div>
    </Modal>
  );
}
