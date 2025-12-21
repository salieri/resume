import { Stack, Title } from '@mantine/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Text as RechartText,
} from 'recharts';
import type { TextProps as RechartTextProps } from 'recharts';

import { useIsMdOrUp } from '@/utils/use-is-md-or-up';
import { useIsPrint } from '@/utils/use-is-print';

import classes from './chart.module.css';
import type { ChartData } from './data';

type RadarChartOverrides = Parameters<typeof RadarChart>[0];

interface TranslatedChartProps {
  data: ChartData[];
  title: string;
  radarChartProps?: RadarChartOverrides;
}

const chartSizing = {
  base: { height: 300, width: 400 },
  md: { height: 240, width: 325 },
  print: { height: 180, width: 300 },
};

const TickWithWordWrap = (
  props: RechartTextProps & { payload: { value: string }; isPrint: boolean },
) => {
  const { x, y, textAnchor, verticalAnchor, payload } = props;
  const fontSize = props.isPrint ? '10px' : '12px';
  const textWidth = props.isPrint ? 150 : 100;

  return (
    <RechartText
      x={x}
      y={y}
      className='recharts-text recharts-polar-angle-axis-tick-value'
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      width={textWidth}
      breakAll={false}
      lineHeight='1.25em'
      fontSize={fontSize}
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

  const isPrint = useIsPrint();
  const isMdOrUp = useIsMdOrUp();

  // eslint-disable-next-line prettier/prettier
  const sizeKey = isPrint ? 'print' : (isMdOrUp ? 'md' : 'base');
  const width = chartSizing[sizeKey].width;
  const height = chartSizing[sizeKey].height;

  const chartColor = 'var(--mantine-color-lime-4)';

  const chart = (
    <RadarChart
      data={translatedData}
      height={height}
      width={width}
      {..._.omit(props.radarChartProps, 'width', 'height', 'data', 'ref', 'children')}
      responsive={false}
      style={{ width, height }}
    >
      <PolarGrid />
      <PolarAngleAxis
        dataKey='label'
        tick={(tickProps) => <TickWithWordWrap isPrint={isPrint} {...tickProps} />}
      />
      <PolarRadiusAxis domain={[0, 5]} axisLine={false} />
      <Radar
        name='value'
        dataKey='value'
        stroke={chartColor}
        fill={chartColor}
        fillOpacity={0.35}
        dot
        isAnimationActive={false}
      />
    </RadarChart>
  );

  return (
    <Stack gap={0} className={classes.chart} align='center'>
      <Title order={5} component='div' className={classes.title}>
        {translatedTitle}
      </Title>

      {chart}
    </Stack>
  );
};
