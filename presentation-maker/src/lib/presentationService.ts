import type { Presentation } from '../store/types/types.ts';
import { tablesDB } from './appwriteClient.ts';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

function prepareData(presentation: Presentation, creatorId: string) {
  return {
    title: presentation.title,
    creatorId: creatorId,
    data: JSON.stringify(presentation),
  };
}

export async function savePresentation(
  presentation: Presentation,
  creatorId: string
) {
  const data = prepareData(presentation, creatorId);
  const permissions = [
    `read("user:${creatorId}")`,
    `write("user:${creatorId}")`,
  ];

  try {
    if (!presentation.isNew) {
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

    return {
      id: doc.$id,
      title: doc.title,
      ...parsedPresentation,
      selection: {
        selectedSlideIds: [],
        selectedElementIds: [],
      },
      mode: {
        type: 'idle' as const,
      },
      isNew: false,
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
      createdAt: row.$createdAt,
      updatedAt: row.$updatedAt,
    }));
  } catch (error) {
    console.error('Ошибка получения списка презентаций:', error);
    throw error;
  }
}
