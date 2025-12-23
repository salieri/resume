import { Anchor, Button, List, Space, ThemeIcon } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

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

  return (
    <Section className={`${classes.section} contactInfoSection`}>
      <List spacing={0} center className={classes.list}>
        {contactInfoData.map(({ caption, url, Icon }) => (
          <List.Item
            key={caption}
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
        {migrationData.map(({ caption, Icon }) => (
          <List.Item
            key={caption}
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
        <Button component='a' className={classes.download} href='/aleksi-asikainen-resume.pdf' download rightSection={<IconDownload size={14} />}>Download as PDF</Button>
      </DisplayOnly>

    </Section>
  );
};
