import { useId } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { cn } from '../../utils/helpers';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong px-4 py-3 shadow-lg rounded-xl text-sm">
      <p className="font-medium text-navy-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-navy-500 dark:text-navy-400">
            {entry.name}:
          </span>
          <span className="font-mono font-semibold text-navy-900 dark:text-white">
            ₹{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {payload?.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm"
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

export default function ComposedChartWidget({
  data = [],
  bars = [],
  lines = [],
  areas = [],
  xAxisKey = 'name',
  title,
  height = 300,
  breakEvenIndex,
  className,
}) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="mb-4 text-base font-display font-semibold text-navy-900 dark:text-white">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <defs>
            {areas.map((area) => (
              <linearGradient key={`grad-${area.dataKey}`} id={`${gradientId}-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={area.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={area.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-navy-200/40 dark:text-navy-700/40"
            vertical={false}
          />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,158,11,0.06)' }} />
          <Legend content={<CustomLegend />} />

          {/* Break-even reference line */}
          {breakEvenIndex !== undefined && data[breakEvenIndex] && (
            <ReferenceLine
              x={data[breakEvenIndex][xAxisKey]}
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{
                value: '✓ Break-even',
                position: 'top',
                fill: '#10B981',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}

          {/* Areas first (behind everything) */}
          {areas.map((area) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name || area.dataKey}
              stroke={area.color}
              strokeWidth={0}
              fill={`url(#${gradientId}-${area.dataKey})`}
            />
          ))}

          {/* Bars */}
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          ))}

          {/* Lines on top */}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
