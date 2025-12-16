import { List, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';
import { TranslatedWorkHistoryItem } from '@/sections/work-history/work-history.item';

import { workHistoryData } from './data';

export const WorkHistory = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='workHistory.title'>Versatile Technology Leader</Trans>
      </Title>
      <Text>
        <Trans i18nKey='workHistory.description'>
          Cross-disciplinary collaborator and communicator, who brings leadership, strategic vision,
          and substantive analysis to technology organizations. Active in research, proof of
          concept, architecture, and build phases. Experienced in DevOps. Advocates modern
          technology and best practices. Helps and trains teams to adopt new methodologies.
        </Trans>
      </Text>

      <List>
        <List.Item>
          <Trans i18nKey='workHistory.executiveLeadership'>Executive leadership</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.companySizes'>
            Bootstraps, startups, scale-ups, enterprises
          </Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.greenfieldProjects'>Greenfield and next gen projects</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.teamRecruitment'>Team recruitment</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.techRevamping'>Technology revamping</Trans>
        </List.Item>
      </List>

      <List>
        <List.Item>
          <Trans i18nKey='workHistory.systemsArchitecture'>Systems and software architecture</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.techResearch'>Technology research and selection</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.agile'>Agile methodologies</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.processDevelopment'>Process development</Trans>
        </List.Item>
        <List.Item>
          <Trans i18nKey='workHistory.chaos'>High tolerance for chaos and change</Trans>
        </List.Item>
      </List>

      <Title order={2}>
        <Trans i18nKey='workHistory.workHistoryTitle'>Pragmatic Solutions, Three Steps Ahead</Trans>
      </Title>

      {workHistoryData.map((data) => (
        <TranslatedWorkHistoryItem data={data} key={`${data.company}:${data.title}`} />
      ))}
    </Section>
  );
};
