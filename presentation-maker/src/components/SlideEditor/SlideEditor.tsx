import style from './SlideEditor.module.css';
import type { Presentation } from '../../store/types/types.ts';
import Slide from '../Slide/Slide.tsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';
import {
  selectCurrentPresentation,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';

export default function SlideEditor() {
  const { slides, size } = useSelector(selectCurrentPresentation);
  const { selection, mode } = useSelector(selectUI);
  const activeSlide = slides.find(
    (slide) =>
      selection.selectedSlideIds[selection.selectedSlideIds.length - 1] ===
      slide.id
  );

  return (
    <div className={style.editor}>
      <div
        className={style.editor__container}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {activeSlide && (
          <Slide slideId={activeSlide.id} isEditable={true} mode={mode} />
        )}
      </div>
    </div>
  );
}
