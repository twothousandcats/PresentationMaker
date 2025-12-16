import style from './CollectionItem.module.css';
import type { Size, Slide } from '../../store/types/types.ts';
import SlideContent from '../SlideContent/SlideContent.tsx';
import { useSelector } from 'react-redux';
import { selectUI } from '../../store/selectors/editorSelectors.ts';
import { formatDate } from '../../store/utils/functions.ts';

type CollectionItemProps = {
  title: string;
  updatedAt: string;
  size: Size;
  preview: Slide;
};

export const CollectionItem = ({
  title,
  updatedAt,
  size,
  preview,
}: CollectionItemProps) => {
  const { selection } = useSelector(selectUI);

  return (
    <>
      <div className={style.collectionItemWrapper}>
        <SlideContent
          slide={preview}
          selection={selection}
          size={size}
          isEditable={false}
          isPreview={true}
        />
      </div>
      <div className={style.preview}>
        <p className={`${style.previewText} ${style.previewHeading}`}>
          {title}
        </p>
        <p className={style.previewText}>{formatDate(updatedAt)}</p>
      </div>
    </>
  );
};
