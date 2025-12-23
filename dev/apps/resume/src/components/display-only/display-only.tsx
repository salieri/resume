import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from './display-only.module.css';

export interface DisplayOnlyProps {
  children?: ReactNode;
}

/**
 * Section that is only visible when printing the document.
 */
export const DisplayOnly = (props: DisplayOnlyProps) => {
  return <Box className={classes.displayOnly}>{props.children}</Box>;
};
