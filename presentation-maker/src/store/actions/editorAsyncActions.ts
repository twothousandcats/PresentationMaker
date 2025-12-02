import type { AppThunk } from 'redux-thunk';
import type { RootState } from '../store.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { uploadFile } from '../../lib/fileService.ts';
import type { SlideElement } from '../types/types.ts';
import { getRandomId } from '../utils/functions.ts';
import { addElementToSlide } from './pureEditorActions.ts';

export const addImageElement =
  (slideId: string, file: File): AppThunk<void, RootState> =>
  async (dispatch, getState) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('Пользователь не авторизован');
        return;
      }

      const imageUrl = await uploadFile(file, user.$id);

      const newElement: SlideElement = {
        id: getRandomId(),
        type: 'rectangle',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        background: {
          type: 'image',
          data: imageUrl
        },
      };

      // Добавляем в слайд
      dispatch(addElementToSlide({ slideId, newElement }));
    } catch (error) {
      console.error('Не удалось добавить изображение:', error);
    }
  };
