import { Card, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import type { Education } from './data';

export interface EducationItemProps {
  data: Education;
}

export const TranslatedEducationItem = (props: EducationItemProps) => {
  const { data } = props;
  const educationKey = `education.${data.title}`;
  const { t } = useTranslation();

  return (
    <Card>
      <Title order={3}>{t(`${educationKey}.title`, data.title)}</Title>

      <Text>
        {t(`${educationKey}.focus`, data.focus)}, {data.institution}, {data.graduationYear}
      </Text>
    </Card>
  );
};
