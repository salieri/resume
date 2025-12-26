import { Anchor, Button, List, Space, ThemeIcon } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';

import { DisplayOnly } from '@/components/display-only/display-only';
import { Section } from '@/components/section/section';

import classes from './contact-info.module.css';
import { contactInfoData, migrationData } from './data';

export const ContactInfo = () => {
  const iconSize = '70%';
  const iconStyle = { width: iconSize, height: iconSize };

  const themeProps = {
    variant: 'outline',
    color: 'gray',
  };

  const { t } = useTranslation();

  return (
    <Section className={`${classes.section} contactInfoSection`}>
      <List spacing={0} center className={classes.list}>
        {contactInfoData(t).map(({ caption, url, Icon, id }) => (
          <List.Item
            key={id}
            icon={(
              <ThemeIcon {...themeProps} mr={0}>
                <Icon style={iconStyle} />
              </ThemeIcon>
            )}
          >
            <Anchor href={url} target='_blank'>
              {caption}
            </Anchor>
          </List.Item>
        ))}
      </List>

      <List spacing={0} center className={classes.list}>
        {migrationData(t).map(({ caption, Icon, id }) => (
          <List.Item
            key={id}
            icon={(
              <ThemeIcon {...themeProps} mr={0}>
                <Icon style={iconStyle} />
              </ThemeIcon>
            )}
          >
            {caption}
          </List.Item>
        ))}
      </List>

      <DisplayOnly>
        <Space h='xs' />
        <Button component='a' className={classes.download} href='/aleksi-asikainen-resume.pdf' download rightSection={<IconDownload size={14} />}><Trans i18nKey='contactInfo.download'>Download PDF</Trans></Button>
      </DisplayOnly>

    </Section>
  );
};
