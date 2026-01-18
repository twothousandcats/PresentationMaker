import style from './NotFound.module.css';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { useDocumentTitle } from '../../store/hooks/useDocumentTitle.ts';
import IconButton from '../../components/IconButton/IconButton.tsx';
import IconLeft from '../../components/Icons/IconLeft.tsx';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  useDocumentTitle(LANGUAGES.ru.pages.notFound);
  const navigate = useNavigate();

  return (
    <div className={style.container}>
      <div className={style.back}>
        <IconButton
          icon={<IconLeft />}
          onClickFn={() => navigate(-1)}
          ariaLabel={LANGUAGES.ru.back}
        />
      </div>
      <p className={style.notFound}>{LANGUAGES.ru.notFoundPage}</p>
    </div>
  );
};
