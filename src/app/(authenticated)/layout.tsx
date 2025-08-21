export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>ini navbar authtenticated</div>
      {children}
    </div>
  );
}
