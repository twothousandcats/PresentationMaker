import style from './SlidesList.module.css';
import type {
    Slide as SlideType,
    Size,
    Selection
} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";
import {dispatch} from "../../store/editor.ts";
import {moveSlides, setSelectedSlides} from "../../store/functions/functions.ts";
import {useCallback} from "react";
import * as React from "react";

interface SlidesListProps {
    slides: SlideType[];
    size: Size;
    selection: Selection;
}

export default function SlidesList(
    {
        slides,
        size,
        selection
    }: SlidesListProps
) {
    const handleDragStart = useCallback((
        evt: React.DragEvent<HTMLLIElement>,
        slideId: string
    ) => {
        const isCurrentSelected = selection.selectedSlideIds.includes(slideId);
        const dragIds = isCurrentSelected
            ? selection.selectedSlideIds
            : [slideId];

        // text/plain
        evt.dataTransfer?.setData('application/json', JSON.stringify(dragIds));
        (evt.dataTransfer as DataTransfer).effectAllowed = 'move';
        (evt.target as HTMLElement).classList.add(style.dragging);
    }, [selection.selectedSlideIds]);

    const handleDragEnd = useCallback((
        evt: React.DragEvent<HTMLLIElement>
    ) => {
        (evt.target as HTMLElement).classList.remove(style.dragging);
    }, []);

    const handleDragOver = useCallback((
        evt: React.DragEvent<HTMLUListElement>
    ) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((
        evt: React.DragEvent<HTMLUListElement>
    ) => {
        evt.preventDefault();

        const data = evt.dataTransfer.getData('application/json');
        let slideIds: string[] = JSON.parse(data);

        if (!Array.isArray(slideIds) || slideIds.length === 0) {
            return;
        }

        const dropTarget = evt.target as HTMLElement;
        let dropListItem = dropTarget.closest(`.${style.holder}`) as HTMLElement | null;

        if (!dropListItem) {
            return;
        }

        const targetIndex = Array.from(dropListItem.parentElement!.children).indexOf(dropListItem);

        // Фильтруем только существующие слайды
        const validSlideIds = slideIds.filter(id =>
            slides.some(slide =>
                slide.id === id));
        if (validSlideIds.length === 0) {
            return;
        }

        // Определяем newIndex: если перетаскиваем вниз — +1, чтобы вставить ПОСЛЕ
        // Но проще: удалим все перетаскиваемые, затем вставим на targetIndex
        // Однако нужно скорректировать targetIndex, если слайды удаляются ДО него
        const firstDraggedIndex = slides.findIndex(s => validSlideIds.includes(s.id));
        let adjustedNewIndex = targetIndex;

        if (firstDraggedIndex !== -1 && firstDraggedIndex < targetIndex) {
            // Если перетаскиваем вниз, нужно компенсировать удаление
            adjustedNewIndex -= validSlideIds.length;
        }

        // допустимые пределы
        const maxIndex = slides.length - validSlideIds.length;
        adjustedNewIndex = Math.max(0, Math.min(adjustedNewIndex, maxIndex));

        dispatch(moveSlides, {
            slideIds: validSlideIds,
            newIndex: adjustedNewIndex
        });

        // Убираем класс dragging
        document.querySelectorAll(`.${style.dragging}`)?.forEach(el => {
            el.classList.remove(style.dragging);
        });
    }, [slides, selection.selectedSlideIds]);

    const handleSelectSlide = (
        evt: React.MouseEvent,
        slide: SlideType
    ) => {
        const {selectedSlideIds} = selection;

        // ctrl || cmd
        if (evt.ctrlKey || evt.metaKey) {
            const isSelected = selectedSlideIds.includes(slide.id);
            const newSelection = isSelected
                ? selectedSlideIds.filter(id => id !== slide.id)
                : [...selectedSlideIds, slide.id];

            dispatch(setSelectedSlides, {
                slideIds: newSelection
            });
        } else if (evt.shiftKey && selectedSlideIds.length > 0) {
            const lastSelectedId = selectedSlideIds[selectedSlideIds.length - 1];
            const lastSelectedIndex = slides.findIndex(slide =>
                slide.id === lastSelectedId
            );
            const currentIndex = slides.findIndex(s =>
                s.id === slide.id
            );

            if (lastSelectedIndex !== -1 && currentIndex !== -1) {
                const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
                const rangeIds = slides.slice(start, end + 1).map(s => s.id);
                dispatch(setSelectedSlides, {slideIds: rangeIds});
            }
        } else {
            dispatch(setSelectedSlides, {
                slideIds: [slide.id]
            });
        }
    };

    return (
        <ul className={style.container}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            {slides.length > 0 && slides.map((slide, index) =>
                <li className={style.holder}
                    key={slide.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, slide.id)}
                    onDragEnd={handleDragEnd}
                    onClick={
                        (evt) => handleSelectSlide(evt, slide)
                    }>
                    <p className={style.holder__num}>
                        {index + 1}
                    </p>
                    <Slide
                        slide={slide}
                        slideSize={size}
                        isEditable={false}
                        isActive={selection.selectedSlideIds.includes(slide.id)}
                        activeElements={selection.selectedSlideIds}
                    />
                </li>
            )}
        </ul>
    );
}