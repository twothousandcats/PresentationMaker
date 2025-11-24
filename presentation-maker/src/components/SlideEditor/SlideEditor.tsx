import style from './SlideEditor.module.css';
import type { Presentation } from '../../store/types/types.ts';
import Slide from '../Slide/Slide.tsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';

// interface EditorProps {
//   slides: SlideType[];
//   size: Size;
//   selection: Selection;
//   mode: EditorMode;
// }

export default function SlideEditor() {
  const { slides, size, selection, mode }: Presentation = useSelector(
    (state: RootState) => state.editor.present
  );
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
