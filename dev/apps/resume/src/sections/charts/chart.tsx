import { RadarChart } from '@mantine/charts';
import { Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Text as RechartText } from 'recharts';
import type { TextProps as RechartTextProps } from 'recharts';

import classes from './chart.module.css';
import type { ChartData } from './data';

interface TranslatedChartProps {
  data: ChartData[];
  title: string;
}

const TickWithWordWrap = (props: RechartTextProps & { payload: { value: string } }) => {
  const { x, y, textAnchor, verticalAnchor, payload } = props;

  return (
    <RechartText
      x={x}
      y={y}
      className='recharts-text recharts-polar-angle-axis-tick-value'
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      width={100}
      breakAll={false}
      lineHeight='1.25em'
    >
      {payload.value}
    </RechartText>
  );
};

export const TranslatedChart = (props: TranslatedChartProps) => {
  const { t } = useTranslation();

  const translatedData = props.data.map((item) => ({
    label: t([`chartLabels.${item.label}`, item.label]),
    value: item.value,
  }));

  const translatedTitle = t([`chartTitles.${props.title}`, props.title]);

  return (
    <Stack gap={0} className={classes.chart}>
      <Title order={5} component='div' className={classes.title}>
        {translatedTitle}
      </Title>
      <RadarChart
        data={translatedData}
        dataKey='label'
        series={[{ name: 'value', color: 'lime.4', opacity: 0.35 }]}
        h={{ base: 300, md: 200 }}
        withPolarGrid
        withPolarAngleAxis
        withPolarRadiusAxis
        withTooltip={false}
        withDots
        polarAngleAxisProps={{ tick: TickWithWordWrap }}
        polarRadiusAxisProps={{ domain: [0, 5], axisLine: false }}
      />
    </Stack>
  );
};
