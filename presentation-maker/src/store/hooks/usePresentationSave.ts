import { useSelector } from 'react-redux';
import { selectCurrentPresentation } from '../selectors/editorSelectors.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOSAVE_DELAY_MS } from '../utils/config.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { savePresentation } from '../../lib/presentationService.ts';

export const usePresentationSave = () => {
  const presentation = useSelector(selectCurrentPresentation);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedPresentationRef = useRef(presentation);

  // Сброс при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      const user = await getCurrentUser();
      const currentUserId = user?.$id;
      if (!currentUserId) {
        console.warn('Пользователь не авторизован, сохранение невозможно');
        return;
      }

      await savePresentation(presentation, currentUserId);

      setIsSaving(false);
      savedPresentationRef.current = presentation;
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  }, [presentation]);

  useEffect(() => {
    // Отмена
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // защита (нужна ли)
    if (presentation === savedPresentationRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, AUTOSAVE_DELAY_MS);
  }, [presentation, save]); // presentation триггер

  return { save, isSaving };
};
