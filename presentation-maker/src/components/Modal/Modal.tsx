import style from './Modal.module.css';
import { type JSX, type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPortal } from '../../store/utils/config.ts';
import * as React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
}: ModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      onClose();
    }
  };

  const handleOverlayClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    if (evt.target !== modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={style.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={style.modal}
        ref={modalRef}
        onClick={(evt) => evt.stopPropagation()}
      >
        {title && <p className={style.title}>{title}</p>}
        {children}
      </div>
    </div>,
    getPortal()!
  );
}
