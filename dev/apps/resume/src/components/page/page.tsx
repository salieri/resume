import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from './page.module.css';

export interface PageProps {
  children?: ReactNode;
}

/**
 * Pagination for print media
 */
export const Page = (props: PageProps) => {
  return <Box className={`${classes.page} page`}>{props.children}</Box>;
};
