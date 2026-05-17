export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-display font-bold tracking-tight ${className}`}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M5 13l3 3 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <span>shofast</span>
    </div>
  );
}
