import style from './Slide.module.css';
import type {
    Size,
    Slide
} from "../../store/types/types.ts";
import SlideElement from "../SlideElement/SlideElement.tsx";
import {concatModifiersByFlag} from "../../store/functions/untils/utils.ts";
import {dispatch} from "../../store/editor.ts";
import {setSelectedElements} from "../../store/functions/functions.ts";

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
    const classNames = concatModifiersByFlag([
        style.slide,
        isEditable ? style.slide_editable : style.slide_preview,
        isActive && style.slide_active,
    ]);
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
                ...(bgImg && {
                    backgroundImage: `url(${bgImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
                ...(isEditable
                    ? {
                        width: `${isEditable ? slideSize.width : ''}px`,
                        height: `${isEditable ? slideSize.height : ''}px`
                    }
                    : {
                        width: '100%',
                        height: 'auto',
                        aspectRatio: `${slideSize.width} / ${slideSize.height}`,
                    }),
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