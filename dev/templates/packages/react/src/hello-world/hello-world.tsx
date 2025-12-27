import { Title } from '@mantine/core';

import classes from './hello-world.module.css';

export function HelloWorld() {
  return (
    <>
      <Title className={classes.hello} ta='center' mt={100}>
        Hello, world!
      </Title>
    </>
  );
}
