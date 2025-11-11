import style from './SlidesList.module.css';
import type {
  Slide as SlideType,
  Size,
  Selection,
} from '../../store/types/types.ts';
import Slide from '../Slide/Slide.tsx';
import { useSelectSlides } from '../../store/hooks/useSelectSlides.ts';
import { useSlidesDND } from '../../store/hooks/useSlidesDND.ts';
import { clearSelection } from '../../store/editorSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';

interface SlidesListProps {
  slides: SlideType[];
  size: Size;
  selection: Selection;
}

export default function SlidesList() {
  const {
    slides,
    selection,
  }: SlidesListProps = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  const { handleSelectSlide } = useSelectSlides({
    slides,
    selectedSlideIds: selection.selectedSlideIds,
  });
  const { handleMouseDown } = useSlidesDND({
    slides,
    selectedSlideIds: selection.selectedSlideIds,
  });

  return (
    <ul className={style.container}>
      {slides.length > 0 &&
        slides.map((slide, index) => (
          <li
            key={slide.id}
            className={style.holder}
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
            <Slide
              slideId={slide.id}
              isEditable={false}
            />
          </li>
        ))}
    </ul>
  );
}
