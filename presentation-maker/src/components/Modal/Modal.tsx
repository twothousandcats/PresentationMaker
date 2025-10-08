import style from './Modal.module.css';
import {JSX, ReactNode, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {getPortal} from "../../store/utils/config.ts";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export function Modal({isOpen, onClose, children, title}: ModalProps): JSX.Element {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }

    const handleOverlayClick = (e: MouseEvent) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className={style.overlay}
             onClick={handleOverlayClick}
             role="dialog"
             aria-modal="true">
            <div className={style.modal}
                 ref={modalRef}
                 onClick={(evt) => evt.stopPropagation()}>
                {title && <p className={style.title}>{title}</p>}
                {children}
            </div>
        </div>,
        getPortal()!
    )
}