import { cn } from '../../utils/helpers';

function Bone({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700',
        className,
      )}
      aria-hidden="true"
    />
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-3">
      <Bone className="h-4 w-3/4" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-5/6" />
      <Bone className="h-4 w-2/3" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-1/3" />
          <Bone className="h-3 w-1/2" />
        </div>
      </div>
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-4/5" />
      <div className="flex gap-3 pt-2">
        <Bone className="h-8 w-20 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Bone className="h-5 w-32" />
        <Bone className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 h-40 pt-4">
        {[40, 65, 50, 80, 55, 72, 60, 45, 75, 58, 68, 52].map((h, i) => (
          <Bone
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Bone className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Bone className="h-4 w-28" />
        <Bone className="h-3 w-20" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="glass overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-6 py-4 border-b border-navy-200/30 dark:border-navy-700/40">
        {[120, 100, 80, 100, 60].map((w, i) => (
          <Bone key={i} className="h-4 rounded" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 px-6 py-4 border-b border-navy-200/10 dark:border-navy-700/20 last:border-0"
        >
          {[120, 100, 80, 100, 60].map((w, i) => (
            <Bone key={i} className="h-3.5 rounded" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}

const variantMap = {
  text: TextSkeleton,
  card: CardSkeleton,
  chart: ChartSkeleton,
  avatar: AvatarSkeleton,
  table: TableSkeleton,
};

export default function SkeletonLoader({
  variant = 'text',
  count = 1,
  className,
}) {
  const Skeleton = variantMap[variant] || TextSkeleton;

  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
