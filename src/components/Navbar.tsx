"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Home,
  Images,
  LogIn,
  LogOut,
  Menu,
  Shield,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FELLOWSHIP_DEPARTMENTS, fellowshipDepartmentSlug } from "@/lib/constants";
import LanguageSwitcher from "./LanguageSwitcher";
import BrandTitle from "./BrandTitle";
import TelegramChatButton from "./TelegramChatButton";

interface NavbarProps {
  variant?: "cover" | "light";
}

const bookLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const, exact: true },
  { href: "/book/graduates", icon: Users, labelKey: "graduates" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/book/gallery", icon: Images, labelKey: "gallery" as const },
];

function NavbarContent({ variant = "cover" }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isManager, logout: managerLogout } = useManagerAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = Boolean(user) || isManager;

  const handleLogout = () => {
    if (isManager) managerLogout();
    if (user) logout();
    setMenuOpen(false);
  };

  const isCover = variant === "cover";
  const showBookLinks =
    pathname.startsWith("/book") ||
    pathname === "/profile" ||
    (isLoggedIn && pathname === "/");
  const isDepartmentsPage = pathname.startsWith("/book/departments");
  const navBg = isCover
    ? "border-white/10 bg-navy/40 backdrop-blur-md lg:border-transparent lg:bg-transparent lg:backdrop-blur-none"
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
      <div className="flex w-full items-center gap-2 px-3 py-1.5 md:px-6 lg:px-8">
        <BrandTitle variant={variant} asLink />

        {isCover && (
          <div className="ml-auto hidden items-center gap-2 lg:flex lg:gap-3">
            {isLoggedIn ? (
              <>
                {isManager ? (
                  <Link
                    href="/managers"
                    className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-xs font-medium text-gold-light transition-colors hover:bg-gold/25"
                  >
                    <Shield className="h-4 w-4" />
                    Managers
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/book"
                      className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white transition-colors chocolate-hover chocolate-hover-cover"
                    >
                      <Home className="h-4 w-4 text-gold" />
                      {t.nav.openBook}
                    </Link>
                    <Link
                      href="/profile"
                      className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white transition-colors chocolate-hover chocolate-hover-cover"
                    >
                      <User className="h-4 w-4 text-gold" />
                      {t.nav.myProfile}
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white transition-colors chocolate-hover chocolate-hover-cover"
                >
                  <LogOut className="h-4 w-4 text-gold" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-xs font-medium text-white transition-colors chocolate-hover chocolate-hover-cover"
                >
                  <LogIn className="h-4 w-4 text-gold" />
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="nav-btn-hover inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy shadow-md transition-colors hover:bg-gold-light"
                >
                  <UserPlus className="h-4 w-4" />
                  {t.nav.signup}
                </Link>
              </>
            )}
            <TelegramChatButton variant="cover" />
            <LanguageSwitcher variant="cover" className="w-auto shrink-0" />
          </div>
        )}

        {showBookLinks && (
          <div className="hidden flex-1 items-center justify-center gap-1 overflow-x-auto sm:flex sm:gap-2">
            {bookLinks.map(({ href, icon: Icon, labelKey, exact }) => {
              const isActive = exact
                ? pathname === href
                : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-btn-hover flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium transition-all duration-200 sm:px-2.5 sm:text-xs ${
                    isActive
                      ? isCover
                        ? "chocolate-nav-active"
                        : "chocolate-nav-active"
                      : isCover
                        ? "text-white/80 chocolate-hover chocolate-hover-cover hover:text-white"
                        : "text-navy/70 chocolate-hover hover:text-navy"
                  }`}
                >
                  <span>{t.nav[labelKey]}</span>
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              );
            })}
          </div>
        )}

        <div
          className={`ml-auto flex shrink-0 items-center gap-2 ${isCover ? "lg:hidden" : ""}`}
        >
          <TelegramChatButton variant={variant} />
          <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`nav-btn-hover rounded-lg border p-1.5 transition-colors ${
              isCover
                ? "border-white/30 text-white chocolate-hover chocolate-hover-cover"
                : "border-navy/15 text-navy chocolate-hover"
            }`}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 mt-2 max-h-[80vh] overflow-y-auto rounded-xl border shadow-lg ${
                isDepartmentsPage ? "w-72" : "w-56"
              } ${
                isCover
                  ? "border-white/20 bg-navy text-white"
                  : "border-[#6b4423]/20 bg-cream text-navy"
              }`}
            >
              {showBookLinks && (
                <div
                  className={`border-b py-2 sm:hidden ${
                    isCover ? "border-white/15" : "border-navy/10"
                  }`}
                >
                  {bookLinks.map(({ href, icon: Icon, labelKey, exact }) => {
                    const isActive = exact
                      ? pathname === href
                      : pathname.startsWith(href);

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? isCover
                              ? "chocolate-nav-active font-medium"
                              : "chocolate-nav-active font-medium"
                            : isCover
                              ? "chocolate-hover chocolate-hover-cover"
                              : "chocolate-hover"
                        }`}
                      >
                        <span>{t.nav[labelKey]}</span>
                        <Icon className="h-3.5 w-3.5 text-gold" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {isDepartmentsPage && (
                <div
                  className={`border-b py-2 ${
                    isCover ? "border-white/15" : "border-navy/10"
                  }`}
                >
                  <p
                    className={`px-4 py-1 text-xs font-semibold tracking-wide uppercase ${
                      isCover ? "text-gold-light" : "text-gold"
                    }`}
                  >
                    {t.departments.title}
                  </p>
                  {FELLOWSHIP_DEPARTMENTS.map((dept) => (
                      <Link
                        key={dept}
                        href={`/book/departments#${fellowshipDepartmentSlug(dept)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isCover ? "chocolate-hover chocolate-hover-cover" : "chocolate-hover"
                        }`}
                      >
                        {dept}
                      </Link>
                    ))}
                </div>
              )}

              {isLoggedIn ? (
                <>
                  {isManager ? (
                    <Link
                      href="/managers"
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                        isCover ? "chocolate-hover chocolate-hover-cover" : "chocolate-hover text-gold"
                      }`}
                    >
                      <Shield className="h-4 w-4 text-gold" />
                      Managers
                    </Link>
                  ) : (
                    <>
                      {isCover && (
                        <Link
                          href="/book"
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors chocolate-hover chocolate-hover-cover lg:hidden"
                        >
                          <Home className="h-4 w-4 text-gold" />
                          {t.nav.openBook}
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          isCover ? "chocolate-hover chocolate-hover-cover lg:hidden" : "chocolate-hover"
                        }`}
                      >
                        <User className="h-4 w-4 text-gold" />
                        {t.nav.myProfile}
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isCover ? "chocolate-hover chocolate-hover-cover" : "chocolate-hover"
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
                      isCover ? "chocolate-hover chocolate-hover-cover lg:hidden" : "chocolate-hover"
                    }`}
                  >
                    <LogIn className="h-4 w-4 text-gold" />
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isCover ? "chocolate-hover chocolate-hover-cover lg:hidden" : "chocolate-hover"
                    }`}
                  >
                    <UserPlus className="h-4 w-4 text-gold" />
                    {t.nav.signup}
                  </Link>
                </>
              )}

              <div
                className={`border-t px-4 py-3 ${
                  isCover ? "border-white/15 lg:hidden" : "border-paper-edge"
                }`}
              >
                <LanguageSwitcher variant={variant} />
              </div>
            </div>
          )}
          </div>
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

  return <nav className={`fixed top-0 right-0 left-0 z-50 border-b ${navBg} h-11`} />;
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<NavbarFallback {...props} />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
