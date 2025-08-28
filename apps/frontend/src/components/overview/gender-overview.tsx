'use client';

import { LabelList, Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useEmployeeOverviewQuery } from '@/hooks/use-employee-query';

const chartConfig = {
  total: {
    label: 'Total',
  },
  male: {
    label: 'Male',
    color: 'var(--chart-1)',
  },
  female: {
    label: 'Female',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function GenderOverview() {
  const { data } = useEmployeeOverviewQuery();
  const chartData = [
    { gender: 'male', total: data?.totalMaleEmployee || 0, fill: 'var(--chart-5)' },
    { gender: 'female', total: data?.totalFemaleEmployee || 0, fill: 'var(--chart-1)' },
  ];
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]'
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey='total' hideLabel />} />
          <Pie data={chartData} dataKey='total'>
            <LabelList
              dataKey='gender'
              className='fill-background'
              stroke='none'
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className='flex items-center justify-center gap-x-2'>
        <div className='w-2 h-2 rounded-full bg-[var(--chart-5)]' />
        <p className='text-sm'>{chartConfig.male.label} </p>
        <div className='w-2 h-2 rounded-full bg-[var(--chart-1)]' />
        <p className='text-sm'>{chartConfig.female.label}</p>
      </div>
    </div>
  );
}
