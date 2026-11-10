"use client";

import { Home, Shield, TrendingUp, FileText, Calculator } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    { id: "home", href: "/", label: "Home", ariaLabel: "Home", icon: Home },
    { id: "insurance", href: "/insurance", label: "Insurance", ariaLabel: "Insurance", icon: Shield },
    { id: "invest", href: "/invest", label: "Invest", ariaLabel: "Investments", icon: TrendingUp },
    { id: "documents", href: "/documents", label: "Docs", ariaLabel: "Documents", icon: FileText },
    { id: "calculators", href: "/calculators", label: "Calc", ariaLabel: "Financial Calculators", icon: Calculator },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[310px] z-50 md:hidden">
      {/* Warm Frosted Glass Floating Dock */}
      <div 
        className="bg-white/90 backdrop-blur-xl border border-stone-200/70 shadow-[0_10px_30px_-6px_rgba(28,25,23,0.07),0_4px_12px_-4px_rgba(28,25,23,0.04)] rounded-2xl py-1 px-1 flex justify-around items-center" 
        role="tablist" 
        aria-label="Primary navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link 
              href={tab.href} 
              key={tab.id} 
              className="relative flex flex-col items-center justify-center py-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 transition-all duration-200 ease-out w-1/5 group active:scale-95" 
              role="tab" 
              aria-selected={isActive} 
              aria-label={tab.ariaLabel}
            >
              {/* Icon Container */}
              <div 
                className={`
                  p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center mb-0.5
                  ${isActive 
                    ? "bg-emerald-900/[0.08]" 
                    : "bg-transparent group-hover:bg-stone-100/60"}
                `}
              >
                <Icon 
                  className={`
                    w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] transition-all duration-200
                    ${isActive 
                      ? "text-emerald-800 scale-105" 
                      : "text-stone-400 group-hover:text-stone-700"}
                  `} 
                  aria-hidden="true" 
                />
              </div>

              {/* Minimal Label */}
              <span 
                className={`
                  text-[10px] sm:text-[10.5px] tracking-tight transition-all duration-200 font-medium
                  ${isActive 
                    ? "text-emerald-900 font-semibold" 
                    : "text-stone-400 group-hover:text-stone-700"}
                `}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}