import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

export interface SectionProps {
  children?: ReactNode;
}

export const Section = (props: SectionProps) => {
  return <div>{props.children}</div>;
};
