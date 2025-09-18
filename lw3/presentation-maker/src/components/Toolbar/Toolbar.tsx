import style from './Toolbar.module.css';
import type {Presentation} from "../../types/types.ts";
import {
    type ChangeEvent,
    useState,
    useRef,
    useEffect
} from 'react';

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
    }, [isExpanded]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            <li className={style.toolbar__item}
                onClick={() => console.log('Добавить слайд')}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24">
                    <path fill="#000000"
                          d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z"/>
                </svg>
            </li>
        </ul>
    )
}