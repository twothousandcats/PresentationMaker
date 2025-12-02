import style from './CollectionPage.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPresentations } from '../../lib/presentationService.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { Loader } from '../../components/Loader/Loader.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';

type PresentationPreview = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export const CollectionPage = () => {
  const [presentationList, setPresentationList] = useState<
    PresentationPreview[]
  >([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const user = await getCurrentUser();
        const creatorId = user?.$id;

        if (!creatorId) {
          console.warn('No user ID found');
          setPresentationList([]);
          return;
        }

        // Запрашиваем презентации
        const userPresentations = await getUserPresentations(creatorId);
        console.log(userPresentations);
        setPresentationList(userPresentations);
      } catch (err) {
        console.error('Не удалось загрузить презентации:', err);
        setPresentationList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  const handleOpenPresentation = (id: string) => {
    navigate(`${PAGES_URL.editorPage}${id}`);
  };

  const handleCreatePresentation = () => {
    navigate(PAGES_URL.editorPage);
  };

  return (
    <section className={style.collection}>
      {loading ? (
        <Loader />
      ) : (
        <div className={style.container}>
          <h2 className={style.heading}>{LANGUAGES.ru.recentPresentations}</h2>
          <ul className={style.collectionList}>
            <li
              className={`${style.collectionItem} ${style.createItem}`}
              onClick={handleCreatePresentation}
            ></li>
            {presentationList.length > 0 &&
              presentationList.map((item) => (
                <li
                  key={item.id}
                  className={style.collectionItem}
                  onClick={() => handleOpenPresentation(item.id)}
                >
                  <p>{item.id}</p>
                  <p>{item.title}</p>
                  <p>{item.createdAt}</p>
                  <p>{item.updatedAt}</p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  );
};
