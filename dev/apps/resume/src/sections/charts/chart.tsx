// import { RadarChart } from '@mantine/charts';
import type { RadarChartProps as MantineRadarChartProps } from '@mantine/charts';
import { Box, Stack, Title } from '@mantine/core';
import { useIsFirstRender, useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { PolarGrid, RadarChart, Text as RechartText } from 'recharts';
import type { TextProps as RechartTextProps } from 'recharts';

import { useIsPrint } from '@/utils/use-is-print';

import classes from './chart.module.css';
import type { ChartData } from './data';

interface TranslatedChartProps {
  data: ChartData[];
  title: string;
  radarChartProps?: MantineRadarChartProps['radarChartProps'];
}

const TickWithWordWrap = (props: RechartTextProps & { payload: { value: string } }) => {
  const { x, y, textAnchor, verticalAnchor, payload } = props;

  const fontSize = useIsPrint() ? '8px' : '12px';

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
      // style={{ fontSize }}
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

  const isPrint = useMediaQuery('print', false, {
    getInitialValueInEffect: false,
  });

  const h = isPrint ? 140 : { base: 300, md: 240 };
  const w = isPrint ? 300 : { base: 400, md: 325 };

  return (
    <Stack gap={0} className={classes.chart} align='center'>
      <Title order={5} component='div' className={classes.title}>
        {translatedTitle}
      </Title>

      <Box h={h} w={w} pos='relative'>
        <RadarChart
          bd='1px solid grey'
          data={translatedData}
          dataKey='label'
          series={[{ name: 'value', color: 'lime.4', opacity: 0.35 }]}
          h={h}
          w={w}
          style={{ overflow: 'hidden' }}
          radarChartProps={props.radarChartProps}
          withPolarGrid
          withPolarAngleAxis
          withPolarRadiusAxis
          withTooltip={false}
          withDots
          polarAngleAxisProps={{ tick: TickWithWordWrap }}
          polarRadiusAxisProps={{ domain: [0, 5], axisLine: false }}
        />
      </Box>
    </Stack>
  );
};
