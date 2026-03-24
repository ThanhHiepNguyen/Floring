export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/85 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <span className="loader" aria-hidden="true" />
        <p className="text-sm font-medium text-white/90">Đang tải trang...</p>
      </div>
    </div>
  );
}

