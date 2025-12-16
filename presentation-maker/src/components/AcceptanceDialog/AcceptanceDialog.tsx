import style from './AcceptanceDialog.module.css';
import { Modal } from '../Modal/Modal.tsx';
import { LANGUAGES } from "../../store/utils/langs.ts";

interface AcceptanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export const AcceptanceDialog  = (
  {
    isOpen,
    onClose,
    onConfirm,
    message,
    title = 'Подтверждение',
    confirmText = LANGUAGES.ru.dialogDelete,
    cancelText = LANGUAGES.ru.dialogCancel,
  }: AcceptanceDialogProps
) => {
  return (
  <Modal isOpen={isOpen} onClose={onClose} title={title} >
    <p className={style.message}>{message}</p>
    <div className={style.actions}>
      <button className={`${style.button} ${style.buttonCancel}`} onClick={onClose}>
        {cancelText}
      </button>
      <button className={`${style.button} ${style.buttonConfirm}`} onClick={onConfirm}>
        {confirmText}
      </button>
    </div>
  </Modal>
  );
}