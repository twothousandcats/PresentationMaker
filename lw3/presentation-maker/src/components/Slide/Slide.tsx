import style from './Slide.module.css';
import type {Presentation} from "../../types/types.ts";
import SlideElement from "../SlideElement/SlideElement.tsx";

export default function Slide(props: Presentation) {
    const pres = {...props};

    return (
        <section className={style.workspace}>
            <div className={style.wrapper}
                 style={{
                     width: `${pres.size.width}%`,
                     height: `${pres.size.height}%`
                 }}>
                {pres.slides.map((slide) =>
                    pres.selection.selectedSlideIds.includes(slide.id) && slide.elements.map((element) =>
                        <SlideElement
                            key={element.id}
                            {...element}/>)
                )}
            </div>
        </section>
    );
}