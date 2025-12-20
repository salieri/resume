import { AppShell } from '@mantine/core';
import type { ReactNode } from 'react';

export interface BodyProps {
  children?: ReactNode;
}

export const Body = (props: BodyProps) => {
  return <AppShell.Main>{props.children}</AppShell.Main>;
};
