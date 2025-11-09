import style from './ModalButton.module.css';

interface ModalButtonProps {
  fn: () => void;
  placeHolder: string;
}

export const ModalButton = ({ fn, placeHolder }: ModalButtonProps) => {
  return (
    <button onClick={fn} className={style.btn}>
      {placeHolder}
    </button>
  );
};
