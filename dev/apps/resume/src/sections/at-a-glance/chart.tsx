import { Stack, Title } from '@mantine/core';
import omit from 'lodash/omit';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Text as RechartText,
} from 'recharts';
import type { TextProps as RechartTextProps } from 'recharts';

import { useIsMdOrUp } from '~/utils/use-is-md-or-up';
import { useIsPrint } from '~/utils/use-is-print';

import classes from './chart.module.css';
import type { Chart } from './data';

type RadarChartOverrides = Parameters<typeof RadarChart>[0];

interface TranslatedChartProps {
  data: Chart;
  radarChartProps?: RadarChartOverrides;
}

const chartSizing = {
  base: { height: 300, width: 400 },
  md: { height: 240, width: 325 },
  print: { height: 120, width: 240 },
};

const TickWithWordWrap = (
  props: RechartTextProps & { payload: { value: string }; isPrint: boolean },
) => {
  const { x, y, textAnchor, verticalAnchor, payload } = props;
  const fontSize = props.isPrint ? '8.5px' : '12px';
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
  const chartData = props.data.data;

  const isPrint = useIsPrint();
  const isMdOrUp = useIsMdOrUp();

  const sizeKey = isPrint ? 'print' : (isMdOrUp ? 'md' : 'base');
  const width = chartSizing[sizeKey].width;
  const height = chartSizing[sizeKey].height;

  const chartColor = 'var(--mantine-color-lime-4)';

  const chart = (
    <RadarChart
      data={chartData}
      height={height}
      width={width}
      {...omit(props.radarChartProps, 'width', 'height', 'data', 'ref', 'children')}
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
      <Title order={5} component='div' className={`${classes.title} title`}>
        {props.data.title}
      </Title>

      {chart}
    </Stack>
  );
};
