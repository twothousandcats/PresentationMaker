import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentPresentation,
  selectHistory,
} from '../selectors/editorSelectors.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOSAVE_DELAY_MS } from '../utils/config.ts';
import { markAsSaved } from '../slices/editorSlice.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { savePresentation } from '../../lib/presentationService.ts';

export const usePresentationSave = () => {
  const dispatch = useDispatch();
  const presentation = useSelector(selectCurrentPresentation);
  const { past } = useSelector(selectHistory);

  const [lastSaveLength, setLastSaveLength] = useState<number>(0);
  const presentationRef = useRef(presentation);
  const pastLengthRef = useRef(past.length);
  const lastSaveLengthRef = useRef(lastSaveLength);

  useEffect(() => {
    presentationRef.current = presentation;
    pastLengthRef.current = past.length;
    lastSaveLengthRef.current = lastSaveLength;
  });

  const save = useCallback(async () => {
    const currentPresentation = presentationRef.current;
    const currentPastLength = pastLengthRef.current;

    // Нет изменений — не сохраняем
    if (currentPastLength === lastSaveLengthRef.current) {
      return;
    }

    try {
      const user = await getCurrentUser();
      const currentUserId = user?.$id;
      if (!currentUserId) {
        console.warn('Пользователь не авторизован, сохранение невозможно');
        return;
      }

      await savePresentation(currentPresentation, currentUserId);
      if (currentPresentation.isNew) {
        dispatch(markAsSaved());
      }
      setLastSaveLength(currentPastLength);
      lastSaveLengthRef.current = currentPastLength; // синхронизируем ref
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await save();
    }, AUTOSAVE_DELAY_MS);

    return () => clearInterval(interval);
  }, [save]);

  return { save, lastSaveLength };
};
