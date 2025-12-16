import type { ReactNode } from 'react';

export interface SectionProps {
  children?: ReactNode;
}

export const Section = (props: SectionProps) => {
  return <>{props.children}</>;
};
