import style from './Slide.module.css';
import type {
    Size,
    Slide
} from "../../store/types/types.ts";
import SlideElement from "../SlideElement/SlideElement.tsx";

type SlideProps = {
    slide: Slide;
    slideSize: Size;
    isEditable?: boolean;
    isActive?: boolean;
    activeElements?: string[];
};

export default function Slide(
    {
        slide,
        slideSize,
        isEditable,
        isActive,
        activeElements
    }: SlideProps) {
    let classNames = `${style.slide}`;
    if (isEditable) {
        classNames += ` ${style.slide_editable}`;
    } else {
        classNames += ` ${style.slide_preview}`;
    }
    if (isActive) {
        classNames += ` ${style.slide_active}`;
    }
    const bgColor = slide.background && slide.background.type === 'solid'
        ? slide.background.color
        : '';
    const bgImg = slide.background && slide.background.type === 'image'
        ? slide.background.data
        : '';

    return (
        <div
            className={classNames}
            style={{
                backgroundColor: `${bgColor}`,
                backgroundImage: `url(${bgImg})`,
            }}>
            {slide.elements.map((element) =>
                <SlideElement
                    key={element.id}
                    element={element}
                    slideSize={slideSize}
                    isEditable={isEditable}
                    isActive={isEditable && activeElements?.includes(element.id)}
                />
            )}
        </div>
    );
}