import style from './Toolbar.module.css';
import type {
    Presentation,
} from "../../store/types/types.ts";
import {
    type ChangeEvent,
    type KeyboardEvent,
    useState,
    useRef,
    useEffect
} from 'react';
import IconPlus from "../Icons/IconPlus.tsx";
import IconUndo from "../Icons/IconUndo.tsx";
import IconRedo from "../Icons/IconRedo.tsx";
import IconDownload from "../Icons/IconDownload.tsx";
import ToolbarButton from "../ToolbarButton/ToolbarButton.tsx";
import IconRemove from "../Icons/IconRemove.tsx";
import IconAddText from "../Icons/IconAddText.tsx";
import IconAddImage from "../Icons/IconAddImage.tsx";
import IconBrush from "../Icons/IconBrush.tsx";
import {
    addElementToSlide,
    addSlide,
    removeSlide,
    renamePresentation
} from "../../store/functions/functions.ts";
import {dispatch} from "../../store/editor.ts";
import {createDefaultImageEl, createDefaultSlide, createDefaultTextEl} from "../../store/functions/untils/utils.ts";

export default function Toolbar(presentation: Presentation) {
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
        { // TODO: delete by btn
            icon: <IconRemove/>,
            fn: () => {
                console.log('Удалить активный слайд');
                dispatch(removeSlide, {slideIdsToRemove: presentation.selection.selectedSlideIds});
            },
            ariaLabel: 'Удалить активный слайд'
        },
        {
            icon: <IconAddText/>,
            fn: () => {
                console.log('Добавить текстовый элемент');
                dispatch(addElementToSlide, {
                        slideId: presentation.selection.selectedSlideIds[0],
                        newElement: createDefaultTextEl()
                    }
                );
            },
            ariaLabel: 'Добавить текстовый элемент'
        },
        {
            icon: <IconAddImage/>,
            fn: () => {
                console.log('Добавить элемент изображение');
                dispatch(addElementToSlide, {
                        slideId: presentation.selection.selectedSlideIds[0],
                        newElement: createDefaultImageEl()
                    }
                );
            },
            ariaLabel: 'Добавить элемент изображение'
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
        {
            icon: <IconBrush/>,
            fn: () => console.log('Палитра/выбор цвета'),
            ariaLabel: 'Палитра/выбор цвета'
        },
    ]
    const [isExpanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(presentation.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLLIElement>(null);

    const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const newTitle = evt.target.value;
        setTitle(newTitle);
        console.log('Новое название: ', newTitle);
        dispatch(renamePresentation, {newName: newTitle});
    }

    const handleInputClick = () => {
        setExpanded(true);
        console.log('Смена названия')
    }

    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            setExpanded(false);
            inputRef.current?.blur();
        } else if (evt.key === 'Escape') {
            setTitle(presentation.title);
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
        <ul className={style.toolbar}>
            <li className={`${style.toolbar__item} ${style.toolbar__item_title}`}
                ref={containerRef}>
                <input className={`${style.toolbar__input} ${isExpanded ? style.toolbar__input_expanded : ''}`}
                       id={presentation.id}
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
    )
}