import * as React from 'react';

export interface ButtonProps {
  /** Estilo visual del botón */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Si se pasa, renderiza <a> en lugar de <button> */
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
