import style from './CollectionPage.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserPresentations,
} from '../../lib/presentationService.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { Loader } from '../../components/Loader/Loader.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { CollectionItem } from '../../components/CollectionItem/CollectionItem.tsx';

type PresentationPreview = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  preview: string;
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

        const sortedPresentations = userPresentations.sort((a, b) => {
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          return dateB - dateA;
        });

        setPresentationList(sortedPresentations);
      } catch (err) {
        console.error('Не удалось загрузить презентации:', err);
        setPresentationList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  const handleCreatePresentation = () => {
    navigate(PAGES_URL.editorPage);
  };

  const handleDeletePresentation = (id: string) => {
    setPresentationList(prev => prev.filter(p => p.id !== id));
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
                <CollectionItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  updatedAt={item.updatedAt}
                  size={JSON.parse(item.size)}
                  preview={JSON.parse(item.preview)}
                  onDelete={handleDeletePresentation}
                />
              ))}
          </ul>
        </div>
      )}
    </section>
  );
};
