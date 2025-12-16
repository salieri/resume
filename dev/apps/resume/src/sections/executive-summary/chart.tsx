import { RadarChart } from '@mantine/charts';
import { Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import type { ChartData } from './data';

interface TranslatedChartProps {
  data: ChartData[];
  title: string;
}

export const TranslatedChart = (props: TranslatedChartProps) => {
  const { t } = useTranslation();

  const translatedData = props.data.map((item) => ({
    label: t([`chartLabels.${item.label}`, item.label]),
    value: item.value,
  }));

  const translatedTitle = t([`chartTitles.${props.title}`, props.title]);

  return (
    <Stack gap={0}>
      <Title order={3}>{translatedTitle}</Title>
      <RadarChart
        data={translatedData}
        dataKey='label'
        series={[{ name: 'value', color: 'lime.4', opacity: 0.35 }]}
        h={300}
        withPolarGrid
        withPolarAngleAxis
        withPolarRadiusAxis
        withTooltip={false}
        withDots
        polarRadiusAxisProps={{ domain: [0, 5], axisLine: false }}
      />
    </Stack>
  );
};
