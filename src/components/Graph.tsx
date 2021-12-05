import { useMemo } from 'react';
import styled from 'styled-components';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import {
  fromUnixTime,
  getUnixTime,
  add,
  differenceInMonths,
  isEqual,
  isBefore,
} from 'date-fns';
import { growthCurve } from './growthCurve';
import { getFormattedDate } from './utils';
import type { Record, Range } from './types';

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-inline: 0.5rem;
  padding-block-end: 2rem;

  & svg {
    overflow: visible;
  }
`;

const calcAgeTicks = (birthDate: Date, range: Range, intervalMonths: number) => {
  const begin = add(birthDate, { months: range[0] });
  const end = add(birthDate, { months: range[1] });
  const ticks = [];

  for (
    let tick = begin;
    isBefore(tick, end) || isEqual(tick, end);
    tick = add(tick, { months: intervalMonths })
  ) {
    ticks.push(tick);
  }

  return ticks.map(tick => getUnixTime(tick));
};

const tickMonthsFormatter = (birthDate: Date) => (recordDate: Date) =>
  `${differenceInMonths(recordDate, birthDate)}`;

export type GrowthGraphProps = {
  birthDate: Date;
  records: Record[];
  monthsRange: Range;
  intervalMonths: number;
  heightRange: Range;
  weightRange: Range;
};

export const Graph = ({
  birthDate,
  records,
  monthsRange,
  intervalMonths,
  heightRange,
  weightRange,
}: GrowthGraphProps) => {
  const domain = [
    getUnixTime(add(birthDate, { months: monthsRange[0] })),
    getUnixTime(add(birthDate, { months: monthsRange[1] })),
  ];

  const ticks = useMemo(
    () => calcAgeTicks(birthDate, monthsRange, intervalMonths),
    [birthDate, monthsRange, intervalMonths],
  );

  const guides = useMemo(
    () =>
      growthCurve.map(d => ({
        ...d,
        date: getUnixTime(add(birthDate, { months: d.month })),
      })),
    [birthDate],
  );

  const formatter = (value: number) => tickMonthsFormatter(birthDate)(fromUnixTime(value));

  return (
    <ChartContainer>
      <ResponsiveContainer aspect={1.4}>
        <ComposedChart
          data={guides}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            horizontalFill={['#C0C0C0', '#FFFFFF']}
            fillOpacity={0.2}
            stroke="lightgrey"
          />
          <Tooltip labelFormatter={getFormattedDate} />
          <Legend verticalAlign="top" height={36}/>
          <XAxis
            dataKey="date"
            tickLine={false}
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={formatter}
            allowDataOverflow
          >
            <Label value="months" position="bottom" />
          </XAxis>
          <YAxis
            yAxisId="weight"
            orientation="left"
            tickLine={false}
            type="number"
            domain={weightRange}
            tickCount={10}
            interval="preserveStart"
            allowDataOverflow
          >
            <Label value="weight" position="left" />
          </YAxis>
          <YAxis
            yAxisId="height"
            orientation="right"
            tickLine={false}
            type="number"
            domain={heightRange}
            tickCount={10}
            interval="preserveStart"
            allowDataOverflow
          >
            <Label value="height" position="right" />
          </YAxis>
          <Area
            type="monotone"
            dataKey="weight"
            yAxisId="weight"
            stroke="none"
            fill="#FF4500"
            fillOpacity={0.2}
            tooltipType="none"
            legendType="none"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="height"
            yAxisId="height"
            stroke="none"
            fill="#1e90ff"
            fillOpacity={0.2}
            tooltipType="none"
            legendType="none"
            activeDot={false}
          />
          <Line
            type="linear"
            name="weight"
            data={records}
            dataKey="weight"
            yAxisId="weight"
            stroke="#ff4500"
            strokeWidth={3}
            dot={{ strokeWidth: 2 }}
          />
          <Line
            type="linear"
            name="height"
            data={records}
            dataKey="height"
            yAxisId="height"
            stroke="#1e90ff"
            strokeWidth={3}
            dot={{ strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
