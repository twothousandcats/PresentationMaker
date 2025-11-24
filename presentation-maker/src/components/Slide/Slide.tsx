import type { EditorMode } from '../../store/types/types.ts';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';
import SlideContent from '../SlideContent/SlideContent.tsx';

type SlideProps = {
  slideId: string;
  isEditable?: boolean;
  mode?: EditorMode;
};

export default function Slide({
  slideId,
  isEditable = false,
  mode,
}: SlideProps) {
  const { slides, size, selection } = useSelector(
    (state: RootState) => state.editor
  );
  const slide = slides.find((slide) => slide.id === slideId);

  if (!slide) {
    return <div>{LANGUAGES.noSlides}</div>;
  }

  return (
    <SlideContent
      slide={slide}
      selection={selection}
      size={size}
      isEditable={isEditable}
      mode={mode}
    />
  );
}
