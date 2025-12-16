import { Card, Text, Title } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';

import type { TechStackCategory } from '@/sections/tech-stack/data';

export interface TechStackItemProps {
  data: TechStackCategory;
}

export const TranslatedTechStackItem = (props: TechStackItemProps) => {
  const { data } = props;
  const techStackKey = `techStack.${data.title}`;
  const { t } = useTranslation();

  return (
    <Card>
      <Title order={3}>
        <Trans i18nKey={`${techStackKey}.title`}>{data.title}</Trans>
      </Title>
      <Text>{data.items.map((item) => t(`${techStackKey}.items.${item}`, item)).join(', ')}</Text>
    </Card>
  );
};
