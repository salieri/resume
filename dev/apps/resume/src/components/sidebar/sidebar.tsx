import { AppShell } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from './sidebar.module.css';

export interface SidebarProps {
  children?: ReactNode;
}

export const Sidebar = (props: SidebarProps) => {
  return <></>;

  // return (
  //   <AppShell.Aside width={'sm'}>
  //     <div className={classes.sidebarMain}>{props.children}</div>
  //   </AppShell.Aside>
  // );
};
