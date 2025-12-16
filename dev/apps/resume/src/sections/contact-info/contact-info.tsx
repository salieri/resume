import { Anchor, Stack, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';

export const ContactInfo = () => {
  return (
    <Section>
      <Title order={1}>Aleksi Asikainen</Title>

      <Text>
        <Trans>
          CTO, Chief Architect, Principal Engineer, Founding Engineer, Senior Staff Engineer
        </Trans>
      </Text>

      <Text>
        <Trans>I build concrete solutions.</Trans>
      </Text>

      <Stack gap={0}>
        <Anchor href='tel:+1817247023'>+1 (817) 247-0723</Anchor>
        <Anchor href='email:ping@getsalieri.com'>ping@getsalieri.com</Anchor>
      </Stack>

      <Stack gap={0}>
        <Anchor href='https://linkedin.com/in/aleksiasikainen'>
          linkedin.com/in/aleksiasikainen
        </Anchor>
        <Anchor href='https://github.com/salieri'>github.com/salieri</Anchor>
      </Stack>

      <Text>
        <Trans>
          US permanent resident
          <br />
          <small>(no employer obligations)</small>
        </Trans>
      </Text>

      <Text>
        <Trans>EU Citizen</Trans>
      </Text>

      <Text>
        <Trans>Can relocate</Trans>
      </Text>
    </Section>
  );
};
