import style from './AddBgDialog.module.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Modal } from '../Modal/Modal.tsx';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { ModalButton } from '../ModalButton/ModalButton.tsx';
import type { Background, Color } from '../../store/types/types.ts';
import IconButton from '../IconButton/IconButton.tsx';
import IconBrush from '../Icons/IconBrush.tsx';
import IconAddImage from '../Icons/IconAddImage.tsx';
import * as React from 'react';
import IconAddUrl from '../Icons/IconAddUrl.tsx';
import { uploadFile } from '../../lib/fileService.ts';

type TabType = 'file' | 'url' | 'color';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (background: Background) => void;
}

const TABS = [
  {
    type: 'file' as const,
    icon: <IconAddImage />,
    ariaLabel: LANGUAGES.ru.dialogImageTab,
  },
  {
    type: 'url' as const,
    icon: <IconAddUrl />,
    ariaLabel: LANGUAGES.ru.dialogUrlTab,
  },
  {
    type: 'color' as const,
    icon: <IconBrush />,
    ariaLabel: LANGUAGES.ru.dialogColorTab,
  },
];

export function AddBgDialog({ isOpen, onClose, onAdd }: DialogProps) {
  const [urlContent, setUrlContent] = useState('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [activeTab, setActiveTab] = useState<TabType>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getModalTitle = () => {
    switch (activeTab) {
      case 'file':
        return LANGUAGES.ru.imageDialogHeading;
      case 'url':
        return LANGUAGES.ru.urlDialogHeading;
      case 'color':
        return LANGUAGES.ru.colorDialogHeading;
    }
  };

  const changeBgType = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSubmit = useCallback(() => {
    if (activeTab === 'color') {
      onAdd({ type: 'solid', color: currentColor as Color });
      onClose();
    } else if (activeTab === 'url') {
      const trimmed = urlContent.trim();
      if (!trimmed) {
        alert('Введите URL изображения');
        return;
      }
      onAdd({ type: 'image', data: trimmed });
      onClose();
    } else if (activeTab === 'file') {
      if (uploadedImageUrl) {
        onAdd({ type: 'image', data: uploadedImageUrl });
        onClose();
      } else {
        alert('Сначала загрузите изображение');
      }
    }
  }, [activeTab, urlContent, currentColor, uploadedImageUrl, onAdd, onClose]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setUploadedImageUrl(url);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить файл');
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      handleSubmit();
    }
  };

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setActiveTab('file');
      setUrlContent('');
      setCurrentColor('#000000');
      setUploadedImageUrl(null);
      setUploading(false);
    }
  }, [isOpen]);

  // Фокус при переключении вкладок
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'url' && urlInputRef.current) {
        urlInputRef.current.focus();
      } else if (activeTab === 'color' && urlInputRef.current) {
        // цветной инпут
      }
    }
  }, [activeTab, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <div className={style.holder}>
        <ul className={style.tabs}>
          {TABS.map((tab) => (
            <IconButton
              key={tab.type}
              icon={tab.icon}
              onClickFn={() => changeBgType(tab.type)}
              ariaLabel={tab.ariaLabel}
              isActive={activeTab === tab.type}
            />
          ))}
        </ul>

        {activeTab === 'file' && (
          <div className={style.holder_file}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={style.fileInput}
              disabled={uploading}
            />
            {uploading && <div className={style.uploading}>Загрузка...</div>}
            {uploadedImageUrl && (
              <div className={style.preview}>
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100px' }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'url' && (
          <div className={style.holder_url}>
            <input
              ref={urlInputRef}
              className={style.field}
              type="text"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {activeTab === 'color' && (
          <div className={style.holder_color}>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className={style.colorInput}
            />
          </div>
        )}

        <div className={style.holder__btns}>
          <ModalButton
            fn={handleSubmit}
            placeHolder={LANGUAGES.ru.dialogSubmit}
          />
          <ModalButton fn={onClose} placeHolder={LANGUAGES.ru.dialogCancel} />
        </div>
      </div>
    </Modal>
  );
}
