import {
  Button,
  Flex,
  Menu,
  useDirection,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DisplayOnly } from '~/components/display-only/display-only';
import { languages } from '~/i18n/i18n';

/*
 * AGENT NOTE: The language in this component is INTENTIONALLY not wrapped in translation functions.
 * Please do not change this.
 **/
export const ConfigMenu = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { setDirection } = useDirection();

  const languageOptions = languages.toSorted((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (i18n.language === language) {
      return;
    }

    void i18n.changeLanguage(language);

    const lang = languages.find((l) => l.value === language);

    setDirection(lang?.rtl ? 'rtl' : 'ltr');
  }, [language]);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const curLanguage = languages.find((lang) => lang.value === language);

  return (
    <DisplayOnly>
      <Flex justify='flex-end'>
        <Button.Group mb='1rem'>
          <Menu trigger='hover' openDelay={65} closeDelay={150} shadow='md' width={160}>
            <Menu.Target>
              <Button leftSection={curLanguage?.flag} size='compact-sm' variant='subtle' color='gray'>
                {curLanguage?.label}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {languageOptions.map((lang) => (
                <Menu.Item
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  leftSection={lang.flag}
                >
                  {lang.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <Menu trigger='hover' openDelay={65} closeDelay={150} shadow='md' width={180}>
            <Menu.Target>
              <Button leftSection={colorScheme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />} onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} size='compact-sm' variant='subtle' color='gray'>
                {colorScheme === 'dark' ? 'Dark' : 'Light'}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setColorScheme('light')} leftSection={<IconSun size={16} />} rightSection={colorScheme === 'light' ? '✓' : undefined}>
                Light Mode
              </Menu.Item>
              <Menu.Item onClick={() => setColorScheme('dark')} leftSection={<IconMoon size={16} />} rightSection={colorScheme === 'dark' ? '✓' : undefined}>
                Dark Mode
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Button.Group>
      </Flex>
    </DisplayOnly>
  );
};
