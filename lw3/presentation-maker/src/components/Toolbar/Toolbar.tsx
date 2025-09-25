import style from './Toolbar.module.css';
import type {Presentation} from "../../store/types/types.ts";
import {
    type ChangeEvent,
    useState,
    useRef,
    useEffect
} from 'react';
import IconPlus from "../Icons/IconPlus.tsx";
import IconPrev from "../Icons/IconPrev.tsx";
import IconNext from "../Icons/IconNext.tsx";
import IconDownload from "../Icons/IconDownload.tsx";
import ToolbarButton from "../ToolbarButton/ToolbarButton.tsx";

const buttons = [
    {
        icon: <IconDownload/>,
        fn: () => console.log('Сохранить как'),
        ariaLabel: 'Сохранить презентацию'
    },
    {
        icon: <IconPlus/>,
        fn: () => console.log('Добавить слайд'),
        ariaLabel: 'Добавить слайд'
    },
    {
        icon: <IconPrev/>,
        fn: () => console.log('undo'),
        ariaLabel: 'undo'
    },
    {
        icon: <IconNext/>,
        fn: () => console.log('redo'),
        ariaLabel: 'redo'
    },
]

export default function Toolbar(presentation: Presentation) {
    const [isExpanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(presentation.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLLIElement>(null);

    const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const newTitle = evt.target.value;
        setTitle(newTitle);
        console.log('Новое название: ', newTitle);
    }

    const handleInputClick = () => {
        setExpanded(true);
        console.log('Смена названия')
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
                       onChange={handleTitleChange}/>
            </li>
            {buttons && buttons.map((btn, index) =>
                <ToolbarButton
                    key={index}
                    icon={btn.icon}
                    onclickFn={btn.fn}
                    aria-label={btn.ariaLabel}
                />
            )}
        </ul>
    )
}