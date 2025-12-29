import style from './NotFound.module.css';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { useDocumentTitle } from '../../store/hooks/useDocumentTitle.ts';

export const NotFound = () => {
  useDocumentTitle(LANGUAGES.ru.pages.notFound);

  return(
    <div className={style.container}>
      <p className={style.notFound}>
        {LANGUAGES.ru.notFoundPage}
      </p>
    </div>
  )
}