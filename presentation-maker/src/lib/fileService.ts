import { storage } from './appwriteClient.ts';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

function prepareFileId(file: File): string {
  // генерация fileId
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8); // 6 символов
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';

  // начало с f_
  let fileId = `f_${timestamp}_${randomPart}.${extension}`;

  // не [a-zA-Z0-9._-]
  fileId = fileId.replace(/[^a-zA-Z0-9._-]/g, '');

  // 255
  if (fileId.length > 255) {
    fileId = fileId.substring(0, 250) + '.' + extension;
  }

  // не начинается с спецсимвола
  if (/^[^a-zA-Z0-9]/.test(fileId)) {
    fileId = 'file_' + fileId;
  }

  // хотя бы один буквенно-цифровой символ
  if (!/[a-zA-Z0-9]/.test(fileId)) {
    fileId = 'default_' + fileId;
  }

  return fileId;
}

// Загружает в appwrite storage и возвращает публичную ссылку
export async function uploadFile(file: File, userId: string): Promise<string> {
  try {
    const fileId = prepareFileId(file);
    const permissions = [`read("user:${userId}")`, `write("user:${userId}")`];

    const response = await storage.createFile({
      bucketId: BUCKET_ID,
      fileId: fileId,
      file: file,
    });

    const publicLink = storage.getFileView({ bucketId: BUCKET_ID, fileId: response.$id });
    console.log(publicLink);

    return publicLink;
  } catch (error) {
    console.log('Ошибка загрузки файла:', {
      code: error?.code,
      message: error?.message,
      type: error?.type,
      response: error?.response,
    });
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
  }
}
