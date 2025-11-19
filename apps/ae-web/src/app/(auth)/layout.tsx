export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl dark:bg-slate-900/90">
        {children}
      </div>
    </div>
  );
}
