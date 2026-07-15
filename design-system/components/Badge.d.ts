import * as React from 'react';

export interface BadgeProps {
  /** navy (UJ), ochre (IVUJUS), neutral, solid */
  tone?: 'navy' | 'ochre' | 'neutral' | 'solid';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
