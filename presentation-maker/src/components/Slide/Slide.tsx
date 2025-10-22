import style from './Slide.module.css';
import type {
    Size,
    Slide,
    Selection,
} from "../../store/types/types.ts";
import SlideElement from "../SlideElement/SlideElement.tsx";
import {concatModifiersByFlag} from "../../store/functions/untils/utils.ts";

type SlideProps = {
    slide: Slide;
    slideSize: Size;
    selection: Selection;
    isEditable?: boolean;
    isActive?: boolean;
    activeElements?: string[];
};

export default function Slide(
    {
        slide,
        slideSize,
        selection,
        isEditable,
        isActive,
        activeElements
    }: SlideProps) {
    const classNames = concatModifiersByFlag([
        style.slide,
        isEditable ? style.slide_editable : style.slide_preview,
        isActive ? style.slide_active : '',
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
                    slideId={slide.id}
                    slideElements={slide.elements}
                    selectedElementsIds={selection.selectedElementIds}
                    isEditable={isEditable}
                    isActive={isEditable && activeElements?.includes(element.id)}
                />
            )}
        </div>
    );
}