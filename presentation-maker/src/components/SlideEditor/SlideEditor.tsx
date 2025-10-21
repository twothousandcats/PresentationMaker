import style from './SlideEditor.module.css';
import type {
    Size,
    Slide as SlideType,
    Selection
} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";

interface EditorProps {
    slides: SlideType[];
    size: Size;
    selection: Selection;
}

export default function SlideEditor(
    {
        slides,
        size,
        selection,
    }: EditorProps
) {
    const activeSlide = slides.find(slide =>
        selection.selectedSlideIds[selection.selectedSlideIds.length - 1] === slide.id
    );

    return (
        <div className={style.editor}>
            <div className={style.editor__container}
                 style={{
                     width: `${size.width}px`,
                     height: `${size.height}px`,
                 }}>
                {activeSlide && (
                    <Slide
                        slide={activeSlide}
                        slideSize={size}
                        isEditable={true}
                        activeElements={selection.selectedElementIds}
                    />
                )}
            </div>
        </div>
    );
};