import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="book-page min-h-screen pt-[calc(3rem+env(safe-area-inset-top,0px))]">
        <Navbar variant="light" />
        <div className="w-full px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-5 sm:pb-5 md:px-10 md:pt-6 md:pb-6 lg:px-14">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
