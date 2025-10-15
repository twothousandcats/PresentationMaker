import style from './Toolbar.module.css';
import type {Background, Selection} from '../../store/types/types.ts';
import {
    type ChangeEvent,
    type KeyboardEvent,
    useState,
    useRef,
    useEffect,
    useCallback,
} from 'react';
import IconPlus from '../Icons/IconPlus.tsx';
import IconUndo from '../Icons/IconUndo.tsx';
import IconRedo from '../Icons/IconRedo.tsx';
import IconDownload from '../Icons/IconDownload.tsx';
import IconRemove from '../Icons/IconRemove.tsx';
import IconAddText from '../Icons/IconAddText.tsx';
import IconDrop from '../Icons/IconDrop.tsx';
import {
    addElementToSlide,
    addSlide,
    changeElementBg,
    changeSlideBg,
    removeSlide,
    renamePresentation,
} from '../../store/functions/functions.ts';
import {dispatch} from '../../store/editor.ts';
import {createDefaultSlide, createDefaultTextEl} from '../../store/functions/untils/utils.ts';
import {AddBgDialog} from '../AddBgDialog/AddBgDialog.tsx';
import IconButton from "../IconButton/IconButton.tsx";

interface ToolbarProps {
    presentationId: string;
    presentationTitle: string;
    presentationSelection: Selection;
}

export default function Toolbar(
    {
        presentationId,
        presentationTitle,
        presentationSelection,
    }: ToolbarProps
) {
    const [isExpanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(presentationTitle);
    const [isAddBgDialogOpen, setIsAddBgDialogOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLLIElement>(null);

    const handleChangeBg = useCallback(
        (content: Background | null) => {
            if (!content) return;

            const {selectedSlideIds, selectedElementIds} = presentationSelection;
            const slideId = selectedSlideIds[0];
            const elementId = selectedElementIds[0];

            if (selectedElementIds.length > 0) {
                dispatch(changeElementBg,
                    {
                        slideId,
                        elementId,
                        newBg: content,
                    });
            } else if (selectedSlideIds.length > 0) {
                dispatch(changeSlideBg, {
                    slideId,
                    newBg: content
                });
            }

            setIsAddBgDialogOpen(false);
        },
        [presentationSelection]
    );

    const handleTitleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        const newTitle = evt.target.value;
        setTitle(newTitle);
        dispatch(renamePresentation, {newName: newTitle});
    }, []);

    const handleKeyDown = useCallback((evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            setExpanded(false);
            inputRef.current?.blur();
        } else if (evt.key === 'Escape') {
            setTitle(presentationTitle);
            setExpanded(false);
            inputRef.current?.blur();
        }
    }, [presentationTitle]);

    const handleClickOutside = useCallback((evt: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(evt.target as Node)) {
            setExpanded(false);
        }
    }, []);

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.select();
        }
    }, [isExpanded]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    const toolbarButtons = [
        {
            icon: <IconDownload/>,
            fn: () => console.log('Сохранить как'),
            ariaLabel: 'Сохранить презентацию',
        },
        {
            icon: <IconPlus/>,
            fn: () => {
                dispatch(addSlide, {newSlide: createDefaultSlide()});
            },
            ariaLabel: 'Добавить слайд',
        },
        {
            icon: <IconRemove/>,
            fn: () => {
                dispatch(removeSlide, {slideIdsToRemove: presentationSelection.selectedSlideIds});
            },
            ariaLabel: 'Удалить активный слайд',
            disabled: presentationSelection.selectedSlideIds.length === 0,
        },
        {
            icon: <IconAddText/>,
            fn: () => {
                const slideId = presentationSelection.selectedSlideIds[0];
                if (slideId) {
                    dispatch(addElementToSlide, {
                        slideId,
                        newElement: createDefaultTextEl(),
                    });
                }
            },
            ariaLabel: 'Добавить текстовый элемент',
            disabled: presentationSelection.selectedSlideIds.length === 0,
        },
        {
            icon: <IconDrop/>,
            fn: () => setIsAddBgDialogOpen(true),
            ariaLabel: 'Изменить фон',
            disabled: presentationSelection.selectedSlideIds.length === 0
                && presentationSelection.selectedElementIds.length === 0,
        },
        {
            icon: <IconUndo/>,
            fn: () => console.log('undo'),
            ariaLabel: 'Отменить действие',
        },
        {
            icon: <IconRedo/>,
            fn: () => console.log('redo'),
            ariaLabel: 'Повторить действие',
        },
    ];

    return (
        <>
            <ul className={style.toolbar}>
                <li className={`${style.toolbar__item} ${style.toolbar__item_title}`} ref={containerRef}>
                    <input
                        className={`${style.toolbar__input} ${isExpanded ? style.toolbar__input_expanded : ''}`}
                        id={presentationId}
                        type="text"
                        value={title}
                        ref={inputRef}
                        onClick={() => setExpanded(true)}
                        onKeyDown={handleKeyDown}
                        onChange={handleTitleChange}
                        readOnly={!isExpanded}
                    />
                </li>
                {toolbarButtons.map((btn, index) => (
                    <IconButton
                        key={index}
                        icon={btn.icon}
                        onClickFn={btn.fn}
                        ariaLabel={btn.ariaLabel}
                        disabled={btn.disabled}
                    />
                ))}
            </ul>

            <AddBgDialog
                isOpen={isAddBgDialogOpen}
                onClose={() => setIsAddBgDialogOpen(false)}
                onAdd={handleChangeBg}
            />
        </>
    );
}