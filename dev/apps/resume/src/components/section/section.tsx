import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

export interface SectionProps {
  children?: ReactNode;
  className?: string;
}

export const Section = (props: SectionProps) => {
  return <Box className={`${props.className || ''} section`}>{props.children}</Box>;
};
