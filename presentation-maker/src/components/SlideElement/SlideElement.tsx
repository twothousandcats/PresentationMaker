import style from './SlideElement.module.css';
import type {
    Size, SlideElement
} from "../../store/types/types.ts";
import {getPercentValue} from "../../store/functions/untils/utils.ts";
import {defaultSlideWidth} from "../../store/utils/config.ts";
import {dispatch, getPresentation} from "../../store/editor.ts";
import {setSelectedElements} from "../../store/functions/functions.ts";

type ElementProps = {
    element: SlideElement;
    slideSize: Size;
    isEditable?: boolean;
    isActive?: boolean;
    onClickFn?: (index: string) => void;
}

export default function SlideElement(
    {
        element,
        slideSize,
        isEditable,
        isActive
    }: ElementProps) {
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

    return (
        <div
            className={`${style.element} ${isActive ? style.element_active : ''} ${!isEditable ? style.element_disabled : ''}`}
            style={{
                top: `${yPercent}%`,
                left: `${xPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
            }}
            onClick={() => {
                console.log(element.id);
                console.log(element.background ?? 'transparent');
                dispatch(setSelectedElements, {elementsIds: [element.id]});
            }}>
            {element.type === 'image'
                ? <img className={style.image}
                       src={element.data}
                       alt={element.id + 'slide element'}/>
                : <p className={style.text}
                     style={{
                         fontFamily: `${element.fontFamily}`,
                         fontSize: `${fontSize}px`,
                         fontWeight: `${element.fontWeight}`,
                         color: `${element.color}`,
                         backgroundColor: `${bgColor}`,
                         backgroundImage: `${bgImg}`,
                     }}>
                    {element.content}
                </p>
            }
        </div>
    );
}