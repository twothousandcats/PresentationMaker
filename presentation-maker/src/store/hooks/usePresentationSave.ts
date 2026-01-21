import { useSelector } from 'react-redux';
import { selectCurrentPresentation } from '../selectors/editorSelectors.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOSAVE_DELAY_MS } from '../utils/config.ts';
import { getCurrentUser } from '../../api/authService.ts';
import { savePresentation } from '../../api/presentationService.ts';

export const usePresentationSave = () => {
  const presentation = useSelector(selectCurrentPresentation);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // хранит ID таймера(для отмены)
  const savedPresentationRef = useRef(presentation); // кэширует последнюю сохранённую версию

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

    // защита
    if (presentation === savedPresentationRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, AUTOSAVE_DELAY_MS);
  }, [presentation, save]);

  return { save, isSaving };
};
