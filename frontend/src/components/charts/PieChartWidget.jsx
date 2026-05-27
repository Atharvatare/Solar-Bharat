import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
          style={{ backgroundColor: raw.color }}
        />
        <span className="font-medium text-navy-900 dark:text-white">{name}</span>
      </div>
      <p className="mt-1 font-mono font-semibold text-navy-700 dark:text-navy-200">
        {value.toLocaleString()} ({raw.percent}%)
      </p>
    </div>
  );
}

function CenterLabel({ viewBox, label, total }) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-navy-900 dark:fill-white font-display font-bold"
        style={{ fontSize: 20 }}
      >
        {label ?? total}
      </text>
      {label && (
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-navy-400 dark:fill-navy-500"
          style={{ fontSize: 11 }}
        >
          Total
        </text>
      )}
    </g>
  );
}

export default function PieChartWidget({
  data = [],
  title,
  centerLabel,
  height = 280,
  className,
}) {
  const enriched = useMemo(() => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return data.map((d) => ({
      ...d,
      percent: total > 0 ? ((d.value / total) * 100).toFixed(1) : 0,
    }));
  }, [data]);

  const total = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data],
  );

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="mb-4 text-base font-display font-semibold text-navy-900 dark:text-white">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="82%"
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={800}
          >
            {enriched.map((entry, i) => (
              <Cell key={i} fill={entry.color} className="outline-none" />
            ))}
            {/* Center label rendered via label prop */}
            {(centerLabel || total) && (
              <CenterLabel label={centerLabel} total={total} />
            )}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        {enriched.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-xs text-navy-500 dark:text-navy-400 font-medium">
              {d.name} ({d.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
