
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The dashboard is disabled.
  return (
    <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Dashboard Disabled</h1>
        <p className="text-muted-foreground">This feature is not currently available.</p>
    </div>
  );
}
