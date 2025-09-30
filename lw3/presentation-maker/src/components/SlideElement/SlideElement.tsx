import style from './SlideElement.module.css';
import type {
    Size, SlideElement
} from "../../store/types/types.ts";

type ElementProps = {
    element: SlideElement;
    slideSize: Size;
    isEditable?: boolean;
    isActive?: boolean;
}

export default function SlideElement(
    {
        element,
        slideSize,
        isEditable,
        isActive
    }: ElementProps) {
    function getPercentValue(v1: number, v2: number): number {
        return (v1 / v2) * 100;
    }

    const bgColor = element.background && element.background.type === 'solid' && element.background.color
        ? element.background.color
        : null;
    const BgImg = element.background && element.background.type === 'image' && element.background.data
        ? element.background.data
        : null;
    /* const BgGradient = element.background && element.background.type === 'gradient' && element.background.gradient
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
            }}>
            {element.type === 'image'
                ? <img className={style.image}
                       src={element.data}
                       alt={element.id + 'slide element'}/>
                : <p className={style.text}
                     style={{
                         fontFamily: `${element.fontFamily}`,
                         fontSize: `${element.fontSize}px`,
                         fontWeight: `${element.fontWeight}`,
                         color: `${element.color}`,
                         backgroundColor: `${bgColor}`,
                         backgroundImage: `${BgImg}`,
                     }}>
                    {element.content}
                </p>
            }
        </div>
    );
}