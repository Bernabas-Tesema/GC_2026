"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Building2,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FELLOWSHIP_DEPARTMENTS } from "@/lib/constants";
import LanguageSwitcher from "./LanguageSwitcher";
import { SITE_BRAND_NAME } from "@/lib/constants";

interface NavbarProps {
  variant?: "cover" | "light";
}

const bookLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const, exact: true },
  { href: "/book/gc-speech", icon: MessageSquare, labelKey: "gcSpeech" as const },
  { href: "/book/gallery", icon: Users, labelKey: "gallery" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
];

function NavbarContent({ variant = "cover" }: NavbarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCover = variant === "cover";
  const showBookLinks = pathname.startsWith("/book");
  const isDepartmentsPage = pathname.startsWith("/book/departments");
  const activeDepartment =
    FELLOWSHIP_DEPARTMENTS.find((d) => d === searchParams.get("dept")) ??
    FELLOWSHIP_DEPARTMENTS[0];
  const textClass = isCover ? "text-white" : "text-navy";
  const navBg = isCover
    ? "border-white/10 bg-navy/40 backdrop-blur-md"
    : "border-paper-edge/80 bg-paper/95 backdrop-blur-md shadow-sm";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 border-b ${navBg}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-8">
        <Link
          href="/"
          className={`shrink-0 font-serif text-sm font-bold md:text-base ${textClass}`}
        >
          {SITE_BRAND_NAME}
        </Link>

        {showBookLinks && (
          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto md:gap-2">
            {bookLinks.map(({ href, icon: Icon, labelKey, exact }) => {
              const isActive = exact
                ? pathname === href
                : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-btn-hover flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                    isActive
                      ? isCover
                        ? "bg-gold text-navy shadow-md"
                        : "bg-navy text-white shadow-md"
                      : isCover
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-navy/70 hover:bg-white/70 hover:text-navy"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.nav[labelKey]}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="relative ml-auto shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`nav-btn-hover rounded-lg border p-2 transition-colors ${
              isCover
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-navy/15 text-navy hover:bg-navy/5"
            }`}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 mt-2 max-h-[80vh] overflow-y-auto rounded-xl border shadow-lg ${
                isDepartmentsPage ? "w-72" : "w-56"
              } ${
                isCover
                  ? "border-white/20 bg-navy text-white"
                  : "border-paper-edge bg-paper text-navy"
              }`}
            >
              {isDepartmentsPage && (
                <div
                  className={`border-b py-2 ${
                    isCover ? "border-white/15" : "border-paper-edge"
                  }`}
                >
                  <p
                    className={`px-4 py-1 text-xs font-semibold tracking-wide uppercase ${
                      isCover ? "text-gold-light" : "text-gold"
                    }`}
                  >
                    {t.departments.title}
                  </p>
                  {FELLOWSHIP_DEPARTMENTS.map((dept) => {
                    const isActive = activeDepartment === dept;

                    return (
                      <Link
                        key={dept}
                        href={`/book/departments?dept=${encodeURIComponent(dept)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? isCover
                              ? "bg-gold/20 font-medium text-gold-light"
                              : "bg-gold/15 font-medium text-navy"
                            : isCover
                              ? "hover:bg-white/10"
                              : "hover:bg-navy/5"
                        }`}
                      >
                        {dept}
                      </Link>
                    );
                  })}
                </div>
              )}

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isCover ? "hover:bg-white/10" : "hover:bg-navy/5"
                    }`}
                  >
                    <User className="h-4 w-4 text-gold" />
                    {t.nav.myProfile}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isCover ? "hover:bg-white/10" : "hover:bg-navy/5"
                    }`}
                  >
                    <LogOut className="h-4 w-4 text-gold" />
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isCover ? "hover:bg-white/10" : "hover:bg-navy/5"
                    }`}
                  >
                    <LogIn className="h-4 w-4 text-gold" />
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isCover ? "hover:bg-white/10" : "hover:bg-navy/5"
                    }`}
                  >
                    <UserPlus className="h-4 w-4 text-gold" />
                    {t.nav.signup}
                  </Link>
                </>
              )}

              <div
                className={`border-t px-4 py-3 ${
                  isCover ? "border-white/15" : "border-paper-edge"
                }`}
              >
                <LanguageSwitcher variant={variant} />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavbarFallback({ variant = "cover" }: NavbarProps) {
  const isCover = variant === "cover";
  const navBg = isCover
    ? "border-white/10 bg-navy/40 backdrop-blur-md"
    : "border-paper-edge/80 bg-paper/95 backdrop-blur-md shadow-sm";

  return <nav className={`fixed top-0 right-0 left-0 z-50 border-b ${navBg} h-[57px]`} />;
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<NavbarFallback {...props} />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
