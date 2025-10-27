import style from './SlideElement.module.css';
import type {
    Position,
    Size,
    SlideElement
} from "../../store/types/types.ts";
import {
    concatModifiersByFlag,
    getPercentValue
} from "../../store/functions/untils/utils.ts";
import {defaultSlideWidth} from "../../store/utils/config.ts";
import {dispatch} from "../../store/editor.ts";
import {
    changeTextElContent,
    setSelectedElements,
} from "../../store/functions/functions.ts";
import {
    type SyntheticEvent,
    useEffect,
    useRef
} from "react";
import * as React from "react";

type ElementProps = {
    element: SlideElement;
    slideSize: Size;
    slideId: string;
    slideElements: SlideElement[];
    selectedElementsIds: string[];
    isEditable?: boolean;
    isActive?: boolean;
    onDragStart?: (clientX: number, clientY: number) => void;
    dragOffset?: Position;
    resizePreview?: { size: Size, position: Position } | null;
}

export default function SlideElement(
    {
        element,
        slideSize,
        slideId,
        isEditable,
        isActive,
        onDragStart,
        dragOffset,
        resizePreview
    }: ElementProps) {
    const textRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (evt: React.MouseEvent) => {
        if (!isActive || !isEditable) {
            return;
        }
        evt.preventDefault(); // !!!

        onDragStart?.(evt.clientX, evt.clientY);
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

    const displaySize = resizePreview?.size || element.size;
    const displayPosition = resizePreview?.position || element.position;

    const xPercent = getPercentValue(displayPosition.x, slideSize.width);
    const yPercent = getPercentValue(displayPosition.y, slideSize.height);
    const widthPercent = getPercentValue(displaySize.width, slideSize.width);
    const heightPercent = getPercentValue(displaySize.height, slideSize.height);

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
                transform: dragOffset ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
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