import type { Presentation } from '../store/types/types.ts';
import { tablesDB } from './appwriteClient.ts';
import { Query } from 'appwrite';
import Ajv from 'ajv';
import {
  presentationSchema,
  type SavedPresentation,
} from './schema/presentationSchema.ts';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

function prepareData(presentation: Presentation, creatorId: string) {
  return {
    title: presentation.title,
    creatorId: creatorId,
    size: JSON.stringify(presentation.size),
    preview: JSON.stringify(presentation.slides[0]),
    data: JSON.stringify(presentation),
  };
}

const ajv = new Ajv({ strict: true, allErrors: true });

export async function savePresentation(
  presentation: Presentation,
  creatorId: string
) {
  console.log('Начало сохранения презентации:', presentation.id);

  const userPresentations = await getUserPresentations(creatorId);
  const presentationExists = userPresentations.some(
    (p) => p.id === presentation.id
  );

  const data = prepareData(presentation, creatorId);
  const permissions = [
    `read("user:${creatorId}")`,
    `write("user:${creatorId}")`,
  ];

  try {
    if (presentationExists) {
      console.log('Презентация успешно обновлена в БД');
      return await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: presentation.id,
        data,
        permissions,
      });
    } else {
      console.log('Презентация успешно сохранена в БД');
      return await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: presentation.id,
        data,
        permissions,
      });
    }
  } catch (error) {
    console.error('Ошибка сохранения презентации: ', error);
    throw error;
  }
}

export async function getPresentation(id: string) {
  try {
    const doc = await tablesDB.getRow({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      rowId: id,
    });

    const parsedPresentation = JSON.parse(doc.data);
    const validate = ajv.compile(presentationSchema);
    const isValid = validate(parsedPresentation);

    if (!isValid) {
      const errorMsg =
        validate.errors
          ?.map(
            (err) =>
              `${err.instancePath || '/'}: ${err.message || 'ошибка валидации'}`
          )
          .join('; ') || 'неизвестная ошибка валидации';

      throw new Error(`Данные презентации не валидные: ${errorMsg}`);
    }

    const validatedPresentation = parsedPresentation as SavedPresentation;

    return {
      ...validatedPresentation,
    } as Presentation;
  } catch (error) {
    console.error('Ошибка загрузки презентации: ', error);
    throw error;
  }
}

export async function getUserPresentations(creatorId: string) {
  try {
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal('creatorId', creatorId)],
    });

    return response.rows.map((row) => ({
      id: row.$id,
      title: row.title,
      preview: row.preview,
      size: row.size,
      createdAt: row.$createdAt,
      updatedAt: row.$updatedAt,
    }));
  } catch (error) {
    console.error('Ошибка получения списка презентаций:', error);
    throw error;
  }
}

export async function removePresentation(id: string) {
  try {
    await tablesDB.deleteRow({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      rowId: id,
    });

    console.log(`Презентация с id: ${id} успешно удалена`);
  } catch (error) {
    console.error('Ошибка удаления презентации: ', error);
    throw error;
  }
}
