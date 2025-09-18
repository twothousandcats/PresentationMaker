import style from './Slide.module.css';
import type {Presentation} from "../../types/types.ts";

export default function Slide(props: Presentation) {
    const pres = {...props};

    return (
        <section className={style.workspace}>
            <div className={style.wrapper}
                 style={{
                     width: pres.size.width,
                     height: pres.size.height
                 }}
            ></div>
        </section>
    );
}