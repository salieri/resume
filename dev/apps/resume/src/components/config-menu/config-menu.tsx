import { Burger, Menu, Radio, useMantineColorScheme } from '@mantine/core';
import type { MantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const colorSchemes: { value: MantineColorScheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

export const ConfigMenu = () => {
  const [opened, { toggle }] = useDisclosure();

  const { setColorScheme } = useMantineColorScheme();

  return (
    <>
      <Menu shadow='md' width={200} opened={opened}>
        <Menu.Target>
          <Burger onClick={toggle} opened={opened} />
        </Menu.Target>
        <Menu.Dropdown>
          <Radio.Group>
            {colorSchemes.map((scheme) => (
              <Radio
                value={scheme.value}
                label={scheme.label}
                key={scheme.value}
                onClick={() => setColorScheme(scheme.value)}
              />
            ))}
          </Radio.Group>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
