import style from './NotFound.module.css';
import { LANGUAGES } from '../../store/utils/langs.ts';

export const NotFound = () => {
  return(
    <div className={style.container}>
      <p className={style.notFound}>
        {LANGUAGES.ru.notFoundPage}
      </p>
    </div>
  )
}