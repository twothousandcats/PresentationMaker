import style from './SlideEditor.module.css';
import type {Presentation} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";

export default function SlideEditor(pres: Presentation) {
    const activeSlide = pres.slides.find(slide =>
        pres.selection.selectedSlideIds.includes(slide.id));

    return (
        <div className={style.editor}>
            <div className={style.editor__container}
                 style={{
                     width: `${pres.size.width}px`,
                     height: `${pres.size.height}px`,
                 }}>
                {activeSlide && (
                    <Slide
                        slide={activeSlide}
                        slideSize={pres.size}
                        isEditable={true}
                        activeElements={pres.selection.selectedElementIds}
                    />
                )}
            </div>
        </div>
    );
};