import style from './CollectionItem.module.css';
import type { Slide } from '../../store/types/types.ts';
import SlideContent from '../SlideContent/SlideContent.tsx';
import { useSelector } from 'react-redux';
import { selectUI } from '../../store/selectors/editorSelectors.ts';
import { formatDate } from '../../store/utils/functions.ts';

type CollectionItemProps = {
  title: string;
  updatedAt: string;
  preview: Slide;
};

export const CollectionItem = ({
  title,
  updatedAt,
  preview,
}: CollectionItemProps) => {
  const { selection } = useSelector(selectUI);

  return (
    <>
      <div className={style.collectionItemWrapper}>
        <SlideContent
          slide={preview}
          selection={selection}
          isEditable={false}
          isPreview={true}
          isCollection={true}
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
