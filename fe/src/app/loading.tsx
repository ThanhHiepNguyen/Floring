export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-b from-emerald-50/95 via-white/95 to-slate-100/95 backdrop-blur-md dark:from-slate-950/95 dark:via-slate-900/95 dark:to-slate-950/95">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 dark:bg-emerald-300 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 dark:bg-emerald-300 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 dark:bg-emerald-300" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Loading page...</p>
      </div>
    </div>
  );
}

