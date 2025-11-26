import type { Presentation } from '../store/types/types.ts';
import { databases } from './appwriteClient.ts';
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
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        presentation.id,
        data,
        permissions
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        presentation.id,
        data,
        permissions
      );
    }
  } catch (error) {
    console.error('Ошибка сохранения презентации: ', error);
    throw error;
  }
}

export async function getPresentation(id: string) {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
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
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('creatorId', creatorId),
    ]);

    return response.documents.map((document) => ({
      id: document.$id,
      title: document.title,
      createdAt: document.$createdAt,
      updatedAt: document.$updatedAt,
    }));
  } catch (error) {
    console.error('Ошибка получения списка презентаций:', error);
    throw error;
  }
}
