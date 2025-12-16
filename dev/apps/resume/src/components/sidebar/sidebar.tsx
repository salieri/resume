import type { ReactNode } from 'react';

import classes from './sidebar.module.css';

export interface SidebarProps {
  children?: ReactNode;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <nav className={classes.sidebar}>
      <div className={classes.sidebarMain}>{props.children}</div>
    </nav>
  );
};
