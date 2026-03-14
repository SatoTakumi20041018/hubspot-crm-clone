export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f]">
      {children}
    </div>
  );
}
