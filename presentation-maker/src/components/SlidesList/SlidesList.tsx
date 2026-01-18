import style from './SlidesList.module.css';
import type { Presentation } from '../../store/types/types.ts';
import Slide from '../Slide/Slide.tsx';
import { useSelectSlides } from '../../store/hooks/useSelectSlides.ts';
import { useSlidesDND } from '../../store/hooks/useSlidesDND.ts';
import { clearSelection } from '../../store/slices/editorSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentPresentation,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';
import { concatClassNames } from '../../store/utils/functions.ts';

export default function SlidesList() {
  const { slides }: Presentation = useSelector(selectCurrentPresentation);
  const { selection }: Presentation = useSelector(selectUI);
  const dispatch = useDispatch();

  const { handleSelectSlide } = useSelectSlides({
    slides,
    selectedSlideIds: selection.selectedSlideIds,
  });
  const { handleMouseDown, dragState } = useSlidesDND({
    slides,
    selectedSlideIds: selection.selectedSlideIds,
  });

  const { draggedIds, targetId, insertAfter } = dragState;

  return (
    <ul className={style.container}>
      {slides.length > 0 &&
        slides.map((slide, index) => (
          <li
            key={slide.id}
            className={style.frame}
            data-slide-id={slide.id}
            onClick={(event) => {
              handleSelectSlide(event, slide);
              if (selection.selectedElementIds.length > 0) {
                dispatch(clearSelection());
              }
            }}
            onMouseDown={(event) => handleMouseDown(event, slide.id)}
          >
            <p className={style.holder__num}>{index + 1}</p>
            <div
              className={concatClassNames([
                style.holder,
                draggedIds.includes(slide.id) && style.holder_dragged,
                targetId === slide.id &&
                  (insertAfter
                    ? style.holder_drop_after
                    : style.holder_drop_before),
              ])}
            >
              <Slide slideId={slide.id} isEditable={false} />
            </div>
          </li>
        ))}
    </ul>
  );
}
