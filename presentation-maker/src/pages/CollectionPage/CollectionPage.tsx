import style from './CollectionPage.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserPresentations,
  removePresentation,
} from '../../lib/presentationService.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { Loader } from '../../components/Loader/Loader.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { CollectionItem } from '../../components/CollectionItem/CollectionItem.tsx';
import IconClose from '../../components/Icons/IconClose.tsx';
import { AcceptanceDialog } from '../../components/AcceptanceDialog/AcceptanceDialog.tsx';
import { useDocumentTitle } from '../../store/hooks/useDocumentTitle.ts';

type ConfirmationState = {
  id: string;
  title: string;
} | null;

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
  const [confirmationToDelete, setConfirmationToDelete] =
    useState<ConfirmationState>(null);
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

  const openDeleteConfirmation = (id: string, title: string) => {
    setConfirmationToDelete({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!confirmationToDelete) return;

    try {
      await removePresentation(confirmationToDelete.id);
      setPresentationList((prev) =>
        prev.filter((p) => p.id !== confirmationToDelete.id)
      );
    } catch (err) {
      console.error('Failed to delete presentation:', err);
      // TODO: toast
    } finally {
      setConfirmationToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationToDelete(null);
  };

  const handleOpenPresentation = (id: string) => {
    navigate(`${PAGES_URL.editorPage}${id}`);
  };

  useDocumentTitle(LANGUAGES.ru.pages.collection);

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
                  <CollectionItem
                    title={item.title}
                    updatedAt={item.updatedAt}
                    size={JSON.parse(item.size)}
                    preview={JSON.parse(item.preview)}
                  />
                  <div
                    className={style.closeBtn}
                    onClick={(event) => {
                      event.stopPropagation();
                      openDeleteConfirmation(item.id, item.title);
                    }}
                  >
                    <IconClose />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {confirmationToDelete && (
        <AcceptanceDialog
          isOpen={true}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={LANGUAGES.ru.deleteDialogHeading}
          message={
            LANGUAGES.ru.deleteDialogTextP1 +
            confirmationToDelete.title +
            LANGUAGES.ru.deleteDialogTextP2
          }
          confirmText={LANGUAGES.ru.dialogDelete}
          cancelText={LANGUAGES.ru.dialogCancel}
        />
      )}
    </section>
  );
};
