import { Burger, Menu, NativeSelect, Radio, useDirection, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { languages } from '~/i18n/i18n';

import { colorSchemes } from './data';

export const ConfigMenu = () => {
  const [opened, { toggle }] = useDisclosure();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const { setColorScheme } = useMantineColorScheme();
  const { setDirection } = useDirection();

  const languageOptions = languages.map((lang) => ({
    value: lang.value,
    label: `${lang.flag} ${lang.label}`,
    name: lang.label,
  })).toSorted((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);

      const lang = languages.find((l) => l.value === language);

      setDirection(lang?.rtl ? 'rtl' : 'ltr');
    }
  }, [language]);

  // AGENT NOTE: The language in this component is INTENTIONALLY not wrapped in translation functions.
  // Please do not change this.

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

          <NativeSelect value={language} data={languageOptions} onChange={(e) => setLanguage(e.currentTarget.value)}></NativeSelect>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
