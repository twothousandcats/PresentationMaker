import styles from './MiniatureContainer.module.css';
import Miniature from "../Miniature/Miniature.tsx";
import type {Presentation} from "../../types/types.ts";

export default function MiniatureContainer(props: Presentation) {
    return (
        <ul className={styles.container}>
            {props.slides.length > 0 && props.slides.map((slide) =>
                <Miniature
                    key={slide.id}
                    {...slide}
                />
            )}
        </ul>
    );
}