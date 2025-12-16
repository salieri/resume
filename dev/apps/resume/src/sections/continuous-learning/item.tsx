import { Card, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import type { ContinuousLearningClass } from './data';

export interface ContinuousLearningItemProps {
  data: ContinuousLearningClass;
}

export const TranslatedContinuousLearningItem = (props: ContinuousLearningItemProps) => {
  const { data } = props;
  const educationKey = `continuousLearning.${data.title}`;
  const { t } = useTranslation();

  return (
    <Card>
      <Title order={3}>{t(`${educationKey}.title`, data.title)}</Title>

      <Text>{data.organization}</Text>
    </Card>
  );
};
