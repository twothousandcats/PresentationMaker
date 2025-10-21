import style from './AddBgDialog.module.css';
import {useEffect, useRef, useState, useCallback} from 'react';
import {Modal} from '../Modal/Modal.tsx';
import {langs} from '../../store/utils/langs.ts';
import {ModalButton} from '../ModalButton/ModalButton.tsx';
import type {Background, Color} from '../../store/types/types.ts';
import IconButton from '../IconButton/IconButton.tsx';
import IconBrush from '../Icons/IconBrush.tsx';
import IconAddImage from '../Icons/IconAddImage.tsx';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (background: Background) => void;
}

const TABS = [
    {
        type: 'image' as const,
        icon: <IconAddImage/>,
        ariaLabel: langs.dialogImageTab,
    },
    {
        type: 'color' as const,
        icon: <IconBrush/>,
        ariaLabel: langs.dialogColorTab,
    },
];

export function AddBgDialog({isOpen, onClose, onAdd}: DialogProps) {
    const [content, setContent] = useState('');
    const [type, setType] = useState<'image' | 'color'>('image');
    const [currentColor, setCurrentColor] = useState('#000000');
    const inputRef = useRef<HTMLInputElement>(null);

    const title = type === 'image' ? langs.imageDialogHeading : langs.colorDialogHeading;

    const changeBgType = useCallback((newType: 'image' | 'color') => {
        setType(newType);
        setContent('');
    }, []);

    const handleSubmit = useCallback(() => {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            onClose();
            return;
        }

        if (type === 'image') {
            onAdd({type: 'image', data: trimmedContent});
        } else {
            onAdd({type: 'solid', color: trimmedContent as Color});
        }
    }, [content, type, onAdd, onClose]);

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            handleSubmit();
        }
    };

    // Управление фокусом и сбросом содержимого при открытии
    useEffect(() => {
        if (isOpen) {
            setContent('');
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    if (type === 'image') {
                        inputRef.current.select();
                    }
                }
            }, 0);
        }
    }, [isOpen, type]);

    return (
        <Modal isOpen={isOpen}
               onClose={onClose}
               title={title}>
            <div className={style.holder}>
                <ul className={style.tabs}>
                    {TABS.map((tab) => (
                        <li key={tab.type}>
                            <IconButton
                                icon={tab.icon}
                                onClickFn={() => changeBgType(tab.type)}
                                ariaLabel={tab.ariaLabel}
                                isActive={type === tab.type}
                            />
                        </li>
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
                            onChange={(e) => {
                                setContent(e.target.value);
                                setCurrentColor(e.target.value);
                            }}
                            defaultValue={currentColor}
                        />
                    </div>
                )}

                <div className={style.holder__btns}>
                    <ModalButton fn={handleSubmit} placeHolder={langs.dialogSubmit}/>
                    <ModalButton fn={onClose} placeHolder={langs.dialogCancel}/>
                </div>
            </div>
        </Modal>
    );
}