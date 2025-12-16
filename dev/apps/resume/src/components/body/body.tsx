import type { ReactNode } from 'react';

export interface BodyProps {
  children?: ReactNode;
}

export const Body = (props: BodyProps) => {
  return <>{props.children}</>;
};
