import style from './SlideElement.module.css';
import type {
    Position,
    Size,
    SlideElement
} from "../../store/types/types.ts";
import {concatModifiersByFlag, getPercentValue} from "../../store/functions/untils/utils.ts";
import {defaultSlideWidth} from "../../store/utils/config.ts";
import {dispatch} from "../../store/editor.ts";
import {
    changeTextElContent,
    setSelectedElements,
    changeElPosition,
} from "../../store/functions/functions.ts";
import {type SyntheticEvent, useEffect, useRef, useState} from "react";
import * as React from "react";

type ElementProps = {
    element: SlideElement;
    slideSize: Size;
    slideId: string;
    slideElements: SlideElement[];
    selectedElementsIds: string[];
    isEditable?: boolean;
    isActive?: boolean;
    onClickFn?: (index: string) => void;
}

export default function SlideElement(
    {
        element,
        slideSize,
        slideId,
        slideElements,
        selectedElementsIds,
        isEditable,
        isActive
    }: ElementProps) {
    const textRef = useRef<HTMLDivElement>(null);

    const [isDragging, setDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const [dragOffset, setDragOffset] = useState<Position>({x: 0, y: 0});
    const dragOffsetRef = useRef<Position>({x: 0, y: 0});
    const dragStartPosition = useRef({clientX: 0, clientY: 0});

    const handleDragStart = (evt: React.MouseEvent) => {
        if (!isActive || !isEditable) {
            return;
        }
        evt.preventDefault(); // !!!

        // инициализация
        setDragging(true);
        isDraggingRef.current = true;
        dragStartPosition.current = {clientX: evt.clientX, clientY: evt.clientY};

        const handleMouseMove = (moveEvent: MouseEvent) => {
            // вычисляем на уровне компонента сдвиг
            const deltaX = moveEvent.clientX - dragStartPosition.current.clientX;
            const deltaY = moveEvent.clientY - dragStartPosition.current.clientY;
            dragOffsetRef.current = {x: deltaX, y: deltaY};
            setDragOffset({x: deltaX, y: deltaY});
        }

        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                // для каждого выделенного
                selectedElementsIds.forEach(id => {
                    // среди остальных на слайде
                    const element = slideElements.find(el => el.id === id);
                    if (element) {
                        // определяем новую со смещением
                        const newPos: Position = {
                            x: element.position.x + dragOffsetRef.current.x,
                            y: element.position.y + dragOffsetRef.current.y
                        };
                        dispatch(changeElPosition, {
                            slideId,
                            elementId: id,
                            newPosition: newPos,
                        })
                    }
                });
            }

            // clear
            setDragging(false);
            setDragOffset({x: 0, y: 0});
            dragOffsetRef.current = {x: 0, y: 0};
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    let fontSize = element.type === 'text'
        ? element.fontSize
        : null;
    if (!isEditable) {
        const scale = defaultSlideWidth / slideSize.width;
        fontSize = fontSize
            ? Math.max(1, Math.round(fontSize * scale))
            : 1;
    }

    const bgColor = element.background?.type === 'solid' && element.background.color
        ? element.background.color
        : null;
    const bgImg = element.background?.type === 'image' && element.background.data
        ? element.background.data
        : null;
    /* const bgGradient = element.background && element.background.type === 'gradient' && element.background.gradient
        ? element.background.gradient
        : null */
    const xPercent = getPercentValue(element.position.x, slideSize.width);
    const yPercent = getPercentValue(element.position.y, slideSize.height);
    const widthPercent = getPercentValue(element.size.width, slideSize.width);
    const heightPercent = getPercentValue(element.size.height, slideSize.height);

    const handleElementClick = () => {
        dispatch(setSelectedElements, {elementsIds: [element.id]});
    }

    const handleTextChange = (evt: SyntheticEvent<HTMLDivElement>) => {
        const newContent = evt.currentTarget.innerHTML;
        dispatch(changeTextElContent, {
            slideId: slideId,
            elementId: element.id,
            newContent: newContent
        });
    }
    const classNames = concatModifiersByFlag([
        style.element,
        isActive ? style.element_active : '',
        !isEditable ? style.element_disabled : '',
    ]);

    useEffect(() => {
        if (isEditable && isActive && element.type === 'text' && textRef.current) {
            textRef.current?.focus();
        }
    }, [isEditable, isActive]);

    return (
        <div
            className={classNames}
            style={{
                top: `${yPercent}%`,
                left: `${xPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,

                // drag styles
                transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
                cursor: isEditable && isActive ? 'move' : 'default',
            }}
            onClick={handleElementClick}
            onMouseDown={handleDragStart}>
            {element.type === 'rectangle'
                ? <div className={style.image}
                       style={{
                           ...(element.background?.type === 'image' && {
                               backgroundImage: `url(${element.background.data}`,
                               backgroundRepeat: 'no-repeat',
                               backgroundSize: 'cover',
                               backgroundPosition: 'left top',
                           }),
                           ...(element.background?.type === 'solid' && {
                               backgroundColor: element.background.color
                           })
                       }}/>
                : <div className={style.text}
                       ref={textRef}
                       contentEditable={isEditable}
                       suppressContentEditableWarning={true}
                       onBlur={handleTextChange}
                       style={{
                           fontFamily: `${element.fontFamily}`,
                           fontSize: `${fontSize}px`,
                           fontWeight: `${element.fontWeight}`,
                           color: `${element.color}`,
                           backgroundColor: `${bgColor}`,
                           backgroundImage: `${bgImg}`,
                       }}>
                    {element.content}
                </div>
            }
        </div>
    );
}