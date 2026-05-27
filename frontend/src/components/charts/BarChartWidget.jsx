import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
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

export default function BarChartWidget({
  data = [],
  bars = [],
  xAxisKey = 'name',
  title,
  height = 300,
  stacked = false,
  className,
}) {
  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="mb-4 text-base font-display font-semibold text-navy-900 dark:text-white">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
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
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
