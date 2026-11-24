import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  isClosing = false,
}: {
  onClick: () => void;
  isClosing?: boolean;
}): React.JSX.Element => (
  <div
    className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
    onClick={onClick}
  />
);
