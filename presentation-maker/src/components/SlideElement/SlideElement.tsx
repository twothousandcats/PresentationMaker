import style from './SlideElement.module.css';
import type {
    Size,
    SlideElement
} from "../../store/types/types.ts";
import {getPercentValue} from "../../store/functions/untils/utils.ts";
import {defaultSlideWidth} from "../../store/utils/config.ts";
import {dispatch} from "../../store/editor.ts";
import {changeTextElContent, setSelectedElements} from "../../store/functions/functions.ts";
import {type SyntheticEvent, useEffect, useRef} from "react";

type ElementProps = {
    element: SlideElement;
    slideSize: Size;
    slideId: string;
    isEditable?: boolean;
    isActive?: boolean;
    onClickFn?: (index: string) => void;
}

export default function SlideElement(
    {
        element,
        slideSize,
        slideId,
        isEditable,
        isActive
    }: ElementProps) {
    const textRef = useRef<HTMLDivElement>(null);

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
        console.log(element.id);
        console.log(element.background ?? 'transparent');
        dispatch(setSelectedElements, {elementsIds: [element.id]});
    }

    const handleTextChange = (evt: SyntheticEvent<HTMLDivElement>) => {
        const newContent = evt.currentTarget.innerHTML;
        console.log('newContent: ', newContent);
        dispatch(changeTextElContent, {
            slideId: slideId,
            elementId: element.id,
            newContent: newContent
        });
    }

    useEffect(() => {
        if (isEditable && isActive && element.type === 'text' && textRef.current) {
            textRef.current?.focus();
        }
    }, [isEditable, isActive]);

    return (
        <div
            className={`${style.element} ${isActive ? style.element_active : ''} ${!isEditable ? style.element_disabled : ''}`}
            style={{
                top: `${yPercent}%`,
                left: `${xPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
            }}
            onClick={handleElementClick}>
            {element.type === 'image'
                ? <img className={style.image}
                       src={element.data}
                       alt={element.id + 'slide element'}/>
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