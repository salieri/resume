import { render, screen } from '@test-utils';

import { HelloWorld } from './hello-world';

describe('HelloWorld component', () => {
  it('has correct title', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello, world!')).toBeDefined();
  });
});
