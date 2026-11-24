import type { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  isClosing?: boolean;
  children?: ReactNode;
};
