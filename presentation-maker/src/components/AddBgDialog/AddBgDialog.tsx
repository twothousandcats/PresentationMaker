import style from './AddBgDialog.module.css';
import {useEffect, useRef, useState} from "react";
import {Modal} from "../Modal/Modal.tsx";
import {langs} from "../../store/utils/langs.ts";
import * as React from "react";
import {ModalButton} from "../ModalButton/ModalButton.tsx";
import type {Background, Color} from "../../store/types/types.ts";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (background: Background) => void;
}

export function AddBgDialog({isOpen, onClose, onAdd}: DialogProps) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('image');
    const [title, setTitle] = useState(langs.imageDialogHeading);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const trimmedContent = content.trim();
        if (trimmedContent) {
            if (type === 'image') {
                onAdd({type: 'image', data: trimmedContent});
            } else if (type === 'color') {
                onAdd({type: 'solid', color: trimmedContent as Color});
            }
        } else {
            onClose();
        }
    };

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            handleSubmit();
        }
    }

    const changeBgState = (curState: string) => {
        if (type === 'image' && curState !== 'image') {
            setType('color');
            setTitle(langs.colorDialogHeading);
        } else if (type === 'color' && curState !== 'color') {
            setType('image');
            setTitle(langs.imageDialogHeading);
        }
    }

    useEffect(() => {
        if (isOpen) {
            setContent('');
        }
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen}
               onClose={onClose}
               title={title}>
            <div className={style.holder}>
                <ul className={style.tabs}>
                    <ModalButton
                        fn={() => changeBgState('image')}
                        placeHolder={langs.dialogImageTab}
                    />
                    <ModalButton
                        fn={() => changeBgState('color')}
                        placeHolder={langs.dialogColorTab}
                    />
                </ul>
                {type === 'image'
                    ? <div className={style.holder_image}>
                        <input className={style.field}
                               ref={inputRef}
                               type="text"
                               value={content}
                               onChange={evt => setContent(evt.target.value)}
                               onKeyDown={handleKeyDown}
                               placeholder='https://example.com/image.jpg'/>
                    </div>
                    : <div className={style.holder_color}></div>
                }
                <div className={style.holder__btns}>
                    <ModalButton
                        fn={handleSubmit}
                        placeHolder={langs.dialogSubmit}
                    />
                    <ModalButton
                        fn={onClose}
                        placeHolder={langs.dialogCancel}
                    />
                </div>
            </div>
        </Modal>
    );
}