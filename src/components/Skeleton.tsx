function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-slate-200 animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-sm p-4 mb-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-12 h-12 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ n = 3 }: { n?: number }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}
