import { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
} from 'recharts';
import { cn } from '../../utils/helpers';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: raw } = payload[0];
  return (
    <div className="glass-strong px-4 py-3 shadow-lg rounded-xl text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: raw.fill }}
        />
        <span className="font-medium text-navy-900 dark:text-white">{name}</span>
      </div>
      <p className="mt-1 font-mono font-semibold text-navy-700 dark:text-navy-200">
        {value}%
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {payload?.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-navy-500 dark:text-navy-400 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RadialBarWidget({
  data = [],
  title,
  height = 300,
  className,
}) {
  const avg = useMemo(() => {
    if (!data.length) return 0;
    return Math.round(data.reduce((s, d) => s + d.value, 0) / data.length);
  }, [data]);

  // Recharts needs data sorted by value for nice rendering
  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.value - b.value),
    [data],
  );

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="mb-4 text-base font-display font-semibold text-navy-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="90%"
            barSize={14}
            data={sortedData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: 'rgba(148,163,184,0.10)' }}
              dataKey="value"
              cornerRadius={8}
              animationDuration={800}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={0}
              content={<CustomLegend />}
              verticalAlign="bottom"
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center average */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: 28 }}>
          <span className="text-2xl font-display font-bold text-navy-900 dark:text-white">
            {avg}%
          </span>
          <span className="text-[11px] text-navy-400 dark:text-navy-500">
            Average
          </span>
        </div>
      </div>
    </div>
  );
}
