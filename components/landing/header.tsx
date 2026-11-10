"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { name: clientName, logo: logoSrc } = siteConfig;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/insurance", label: "Insurance" },
    { href: "/invest", label: "Investments" },
    { href: "/documents", label: "Documents" },
    { href: "/calculators", label: "Calculators" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-[#faf9f5]/90 backdrop-blur-xl border-b border-stone-200/70 shadow-sm" 
            : "bg-[#faf9f5]/75 backdrop-blur-md border-b border-stone-200/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Left - Brand Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none">
            <Image
              src={logoSrc}
              alt={`${clientName} Logo`}
              width={32}
              height={32}
              className="w-7 h-7 sm:w-[30px] sm:h-[30px] object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <span className="text-[15px] sm:text-base font-bold font-serif text-stone-900 tracking-tight">
              WealthWise
            </span>
          </Link>

          {/* Center - Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/70 p-1 rounded-full border border-stone-200/60" aria-label="Desktop navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-emerald-900 shadow-sm font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right - Subtle Direct Contact Link */}
          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on WhatsApp"
              className="group inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-stone-200/90 bg-white/80 hover:bg-emerald-600 hover:border-emerald-600 text-stone-700 hover:text-white text-xs font-medium shadow-2xs hover:shadow-xs transition-all duration-200 ease-out"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors duration-200" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
