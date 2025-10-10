import style from './AddElementBgDialog.module.css';
import {useEffect, useRef, useState} from "react";
import {Modal} from "../Modal/Modal.tsx";
import {langs} from "../../store/utils/langs.ts";
import * as React from "react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (url: string) => void;
}

export function AddElementBgDialog({isOpen, onClose, onAdd}: DialogProps) {
    const [url, setUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const trimmed = url.trim();
        if (trimmed) {
            onAdd(url)
        } else {
            onClose();
        }
    }

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            handleSubmit();
        }
    }

    useEffect(() => {
        if (isOpen) {
            setUrl('');
        }
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={langs.imageDialogHeading}>
            <div className={style.holder}>
                <input className={style.field}
                       ref={inputRef}
                       type="text"
                       value={url}
                       onChange={evt => setUrl(evt.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder='https://example.com/image.jpg'/>
                <div className={style.holder__btns}>
                    <button onClick={handleSubmit}
                            className={style.btn}>
                        {langs.imageDialogSubmit}
                    </button>
                    <button onClick={onClose}
                            className={style.btn}>
                        {langs.imageDialogCancel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}