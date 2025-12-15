import style from './CollectionItem.module.css';
import { removePresentation } from '../../lib/presentationService.ts';
import IconClose from '../Icons/IconClose.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';
import { useNavigate } from 'react-router-dom';
import type { Size, Slide } from '../../store/types/types.ts';
import SlideContent from '../SlideContent/SlideContent.tsx';
import { useSelector } from 'react-redux';
import { selectUI } from '../../store/selectors/editorSelectors.ts';
import { formatDate } from '../../store/utils/functions.ts';

type CollectionItemProps = {
  id: string;
  title: string;
  updatedAt: string;
  size: Size;
  preview: Slide;
  onDelete: (id: string) => void;
};

export const CollectionItem = ({
  id,
  title,
  updatedAt,
  size,
  preview,
  onDelete,
}: CollectionItemProps) => {
  const navigate = useNavigate();
  const { selection } = useSelector(selectUI);

  const handleOpenPresentation = (id: string) => {
    navigate(`${PAGES_URL.editorPage}${id}`);
  };

  console.log(size);
  console.log(preview);
  return (
    <li
      key={id}
      className={style.collectionItem}
      onClick={() => handleOpenPresentation(id)}
    >
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
      <div
        className={style.closeBtn}
        onClick={async (event) => {
          event.stopPropagation();
          try {
            await removePresentation(id);
            onDelete(id);
          } catch (err) {
            // toast
          }
        }}
      >
        <IconClose />
      </div>
    </li>
  );
};
