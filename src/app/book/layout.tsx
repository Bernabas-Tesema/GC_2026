import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="book-page min-h-screen pt-16">
        <Navbar variant="light" />
        <div className="w-full px-4 py-4 md:px-8 md:py-6 lg:px-10">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
