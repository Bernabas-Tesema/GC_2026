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
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
