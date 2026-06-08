import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white pt-16">
        <Navbar variant="light" />
        <div className="mx-auto max-w-6xl px-3 py-2 md:px-4">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
