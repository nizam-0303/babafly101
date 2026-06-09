export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="h-52 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="flex justify-between items-center">
          <div className="h-5 w-16 rounded shimmer" />
          <div className="h-3 w-12 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
