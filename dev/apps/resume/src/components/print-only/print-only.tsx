import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from './print-only.module.css';

export interface PrintOnlyProps {
  children?: ReactNode;
}

/**
 * Section that is only visible when printing the document.
 */
export const PrintOnly = (props: PrintOnlyProps) => {
  return <Box className={classes.printOnly}>{props.children}</Box>;
};
