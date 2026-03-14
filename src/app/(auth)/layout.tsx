export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2D3E50] to-[#1a252f]">
      {children}
    </div>
  );
}
