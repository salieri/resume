import { ColorSchemeToggle } from '~/components/color-scheme-toggle/color-scheme-toggle';
import { Welcome } from '~/components/welcome/welcome';

export default function Home() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
