import { Anchor, List, ThemeIcon } from '@mantine/core';

import { Section } from '@/components/section/section';

import classes from './contact-info.module.css';
import { contactInfoData, migrationData } from './data';

export const ContactInfo = () => {
  const iconSize = '70%';
  const iconStyle = { width: iconSize, height: iconSize };

  const themeVariant = 'outline';
  const themeColor = 'gray';

  const themeProps = {
    variant: themeVariant,
    color: themeColor,
    // display: { base: 'none' },
  };

  return (
    <Section>
      <List spacing={0} center className={classes.list}>
        {contactInfoData.map(({ caption, url, Icon }) => (
          <List.Item
            key={caption}
            icon={
              <ThemeIcon {...themeProps} mr={0}>
                <Icon style={iconStyle} />
              </ThemeIcon>
            }
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
            icon={
              <ThemeIcon {...themeProps} mr={0}>
                <Icon style={iconStyle} />
              </ThemeIcon>
            }
          >
            {caption}
          </List.Item>
        ))}
      </List>
    </Section>
  );
};
