import { Anchor, Card, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import type { Project } from './data';

export interface ProjectItemProps {
  data: Project;
}

export const TranslatedProjectItem = (props: ProjectItemProps) => {
  const { data } = props;
  const projectKey = `projects.${data.name}`;
  const { t } = useTranslation();

  return (
    <Card>
      <Title order={3}>{t(`${projectKey}.name`, data.name)}</Title>

      <Text>
        <Anchor href={data.url}>{data.url.replace('https://', '')}</Anchor>
      </Text>

      <Text>{t(`${projectKey}.description`, data.description)}</Text>
    </Card>
  );
};
