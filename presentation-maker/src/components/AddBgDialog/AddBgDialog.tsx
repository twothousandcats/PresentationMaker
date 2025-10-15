import style from './AddBgDialog.module.css';
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {Modal} from "../Modal/Modal.tsx";
import {langs} from "../../store/utils/langs.ts";
import * as React from "react";
import {ModalButton} from "../ModalButton/ModalButton.tsx";
import type {HEXColor, SolidColorBackground} from "../../store/types/types.ts";
import {dispatch} from "../../store/editor.ts";
import {changeSlideBg} from "../../store/functions/functions.ts";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (
        url: string,
        type: string
    ) => void;
}

export function AddBgDialog({isOpen, onClose, onAdd}: DialogProps) {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('image');
    const [title, setTitle] = useState(langs.imageDialogHeading);
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

    const handelChangeColor = (evt: ChangeEvent<HTMLInputElement>) => {
        const newBg: SolidColorBackground = {
            type: 'solid',
            color: evt.currentTarget.value as HEXColor
        };
        dispatch(changeSlideBg, {
            slideId: presentationSelection.selectedSlideIds[0],
            newBg: newBg
        });
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
            setUrl('');
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
                               value={url}
                               onChange={evt => setUrl(evt.target.value)}
                               onKeyDown={handleKeyDown}
                               placeholder='https://example.com/image.jpg'/>
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
                    : <div className={style.holder_color}></div>
                }
            </div>
        </Modal>
    );
}