import type { EditorMode } from '../../store/types/types.ts';
import { useSelector } from 'react-redux';
import { LANGUAGES } from '../../store/utils/langs.ts';
import SlideContent from '../SlideContent/SlideContent.tsx';
import {
  selectCurrentPresentation,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';

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
  const { slides, size } = useSelector(selectCurrentPresentation);
  const { selection } = useSelector(selectUI);
  const slide = slides.find((slide) => slide.id === slideId);

  if (!slide) {
    return <div>{LANGUAGES.ru.noSlides}</div>;
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
