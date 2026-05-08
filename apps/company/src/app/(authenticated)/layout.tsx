import { Topbar } from "@/components/layout/topbar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050505" }}>
      <Topbar />
      <main>{children}</main>
    </div>
  );
}
