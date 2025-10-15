import style from './Toolbar.module.css';
import type {
    Selection,
} from "../../store/types/types.ts";
import {
    type ChangeEvent,
    type KeyboardEvent,
    useState,
    useRef,
    useEffect,
} from 'react';
import IconPlus from "../Icons/IconPlus.tsx";
import IconUndo from "../Icons/IconUndo.tsx";
import IconRedo from "../Icons/IconRedo.tsx";
import IconDownload from "../Icons/IconDownload.tsx";
import ToolbarButton from "../ToolbarButton/ToolbarButton.tsx";
import IconRemove from "../Icons/IconRemove.tsx";
import IconAddText from "../Icons/IconAddText.tsx";
import IconAddImage from "../Icons/IconAddImage.tsx";
import {
    addElementToSlide,
    addSlide,
    removeSlide,
    renamePresentation
} from "../../store/functions/functions.ts";
import {dispatch} from "../../store/editor.ts";
import {createImageEl, createDefaultSlide, createDefaultTextEl} from "../../store/functions/untils/utils.ts";
import {AddBgDialog} from "../AddBgDialog/AddBgDialog.tsx";

interface ToolbarProps {
    presentationId: string;
    presentationTitle: string;
    presentationSelection: Selection;
}

export default function Toolbar(
    {
        presentationId,
        presentationTitle,
        presentationSelection
    }: ToolbarProps
) {
    const buttons = [
        {
            icon: <IconDownload/>,
            fn: () => console.log('Сохранить как'),
            ariaLabel: 'Сохранить презентацию'
        },
        {
            icon: <IconPlus/>,
            fn: () => {
                console.log('Добавить слайд');
                dispatch(addSlide, {newSlide: createDefaultSlide()});
            },
            ariaLabel: 'Добавить слайд'
        },
        {
            icon: <IconRemove/>,
            fn: () => {
                console.log('Удалить активный слайд');
                dispatch(removeSlide, {slideIdsToRemove: presentationSelection.selectedSlideIds});
            },
            ariaLabel: 'Удалить активный слайд'
        },
        {
            icon: <IconAddText/>,
            fn: () => {
                console.log('Добавить текстовый элемент');
                dispatch(addElementToSlide, {
                        slideId: presentationSelection.selectedSlideIds[0],
                        newElement: createDefaultTextEl()
                    }
                );
            },
            ariaLabel: 'Добавить текстовый элемент'
        },
        {
            icon: <IconAddImage/>,
            fn: () => {
                setIsAddBgDialogOpen(true);
            },
            ariaLabel: 'Изменить фон'
        },
        {
            icon: <IconUndo/>,
            fn: () => console.log('undo'),
            ariaLabel: 'undo'
        },
        {
            icon: <IconRedo/>,
            fn: () => console.log('redo'),
            ariaLabel: 'redo'
        },
    ];
    const [isExpanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(presentationTitle);
    const [isAddBgDialogOpen, setIsAddBgDialogOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLLIElement>(null);

    const handleChangeBg = (url: string, type: string) => {
        // TODO: Для добавляемого изображения на фон
        //  Проверка на Selection,
        //  если есть выбранный элемент -> changeElementBg
        //  иначе changeSlideBg
        dispatch(addElementToSlide, {
                slideId: presentationSelection.selectedSlideIds[0],
                newElement: createImageEl(url)
            }
        );
        setIsAddBgDialogOpen(false);
    }

    const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const newTitle = evt.target.value;
        setTitle(newTitle);
        console.log('Новое название: ', newTitle);
        dispatch(renamePresentation, {newName: newTitle});
    }

    const handleInputClick = () => {
        setExpanded(true);
        console.log('Смена названия');
    }

    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            setExpanded(false);
            inputRef.current?.blur();
        } else if (evt.key === 'Escape') {
            setTitle(presentationTitle);
            setExpanded(false);
            inputRef.current?.blur();
        }
    }

    const handleClickOutside = (evt: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(evt.target as Node)) {
            setExpanded(false);
        }
    }

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.select();
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);

    return (
        <>
            <ul className={style.toolbar}>
                <li className={`${style.toolbar__item} ${style.toolbar__item_title}`}
                    ref={containerRef}>
                    <input className={`${style.toolbar__input} ${isExpanded ? style.toolbar__input_expanded : ''}`}
                           id={presentationId}
                           type="text"
                           value={title}
                           ref={inputRef}
                           onClick={handleInputClick}
                           onKeyDown={handleKeyDown}
                           onChange={handleTitleChange}
                           readOnly={!isExpanded}/>
                </li>
                {buttons.map((btn, index) =>
                    <ToolbarButton
                        key={index}
                        icon={btn.icon}
                        onClickFn={btn.fn}
                        ariaLabel={btn.ariaLabel}
                    />
                )}
            </ul>
            <AddBgDialog
                isOpen={isAddBgDialogOpen}
                onClose={() => setIsAddBgDialogOpen(false)}
                onAdd={handleChangeBg}
            />
        </>
    )
}