import { ModalUI } from '@ui';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import type { TModalProps } from './type';

const modalRoot = document.getElementById('modals');

/* Должно совпадать с длительностью анимации закрытия в CSS */
const CLOSE_DURATION = 300;

export const Modal = memo(function Modal({
  title,
  onClose,
  children,
}: TModalProps): React.JSX.Element {
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const handleClose = useCallback((): void => {
    if (timerRef.current !== undefined) return;
    setIsClosing(true);
    timerRef.current = window.setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  useEffect(
    () => (): void => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [handleClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={handleClose} isClosing={isClosing}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
