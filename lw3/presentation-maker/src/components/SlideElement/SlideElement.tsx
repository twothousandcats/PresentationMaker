import style from './SlideElement.module.css';
import type {SlideElement} from "../../types/types.ts";

export default function SlideElement(element: SlideElement) {
    const curElement = {...element};
    return (
        <div className={style.element}
             style={{
                 top: `${curElement.position.y}px`,
                 left: `${curElement.position.x}px`,
                 width: `${curElement.size.width}px`,
                 height: `${curElement.size.height}px`,
             }}
             onClick={() => {
                 console.log(curElement.id);
                 console.log(curElement.background ?? 'transparent');
             }}>
            {curElement.type === 'image'
                ? <img className={style.image}
                       src={curElement.data} alt={curElement.id + 'slide element'}/>
                : <p className={style.text}
                    style={{
                        fontFamily: `${curElement.fontFamily}`,
                        fontSize: `${curElement.fontSize}px`,
                        color: `${curElement.color}`,
                        backgroundColor: `${curElement.background ?? 'transparent'}`,
                    }}>
                    {curElement.content}
                </p>
            }
        </div>
    );
}