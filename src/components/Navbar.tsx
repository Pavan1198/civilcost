import React, { useEffect, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Link } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn, user, openAnalyzer, openLogin, openSignup, logout } =
    useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) {
      return;
    }

    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white/90 py-3 shadow-sm backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary"
        >
          <BrandLogo iconClassName="h-9 w-9" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-primary">
            How it Works
          </a>
          <a href="#features" className="transition-colors hover:text-primary">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-primary">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setUserMenuOpen((current) => !current);
                  }}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden max-w-[100px] truncate sm:block">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user?.email || user?.phone}
                      </p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={openAnalyzer}
                className="rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Analyze Quote
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => openLogin()}
                className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:block"
              >
                Log In
              </button>
              <Button
                onClick={() => openSignup(scrollToPricing)}
                className="rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
              >
                Sign Up Free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
