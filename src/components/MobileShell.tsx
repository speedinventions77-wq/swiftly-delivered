export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
      {children}
    </div>
  );
}
