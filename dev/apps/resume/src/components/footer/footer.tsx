import { AppShell } from '@mantine/core';
import type { ReactNode } from 'react';

export interface FooterProps {
  children?: ReactNode;
}

export const Footer = (props: FooterProps) => {
  return <></>;
  // return <AppShell.Footer>{props.children}</AppShell.Footer>;
};
