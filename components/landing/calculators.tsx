'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SimplePageHeader } from "@/components/ui/simple-page-header";
import { AnimatedSection } from "@/components/ui/animated-section";
import InvestmentCalculator from "@/components/landing/investment-return-calculator";
import { ChildEducationCalculatorWithToggle } from "@/components/landing/child-education-planner";
import ChildMarriageCalculator from "@/components/landing/child-marriage-planner";
import RetirementPlanner from "@/components/landing/retirement-planner";
import { cn } from "@/lib/utils";

export default function CalculatorsContent() {

  const [activeCategory, setActiveCategory] = useState<'all' | 'investment' | 'education' | 'retirement' | 'marriage'>('all');
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const smoothSlide = (targetLeft: number, duration = 650) => {
    const container = filterScrollRef.current;
    if (!container) return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startLeft = container.scrollLeft;
    const distance = targetLeft - startLeft;
    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gentle cubic deceleration: silky smooth and slow
      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = startLeft + distance * ease;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handleCategorySelect = (
    category: 'all' | 'investment' | 'education' | 'retirement' | 'marriage',
    index: number
  ) => {
    setActiveCategory(category);

    // Only on mobile screens (< 640px)
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      const container = filterScrollRef.current;
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          // When selecting the rightmost visible filter (index >= 2), slide smoothly and slowly
          // to the left so the hidden filters come into view. Earlier filters slide back to the start.
          const target = index >= 2 ? maxScroll : 0;
          smoothSlide(target, 650);
        }
      }
    }
  };

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1).toLowerCase();
        if (id.includes("investment")) {
          handleCategorySelect("investment", 1);
        } else if (id.includes("education")) {
          handleCategorySelect("education", 2);
        } else if (id.includes("income") || id.includes("retirement")) {
          handleCategorySelect("retirement", 3);
        } else if (id.includes("marriage") || id.includes("wedding")) {
          handleCategorySelect("marriage", 4);
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Category Filter */}
      <div className="flex flex-col items-center mb-5 sm:mb-6">
        <SimplePageHeader 
          title="Financial Calculators" 
          description="Plan your investments, education funds, retirement corpus, and life milestones."
          className="mb-4 sm:mb-5"
        />

        {/* Segmented Category Filter */}
        <div 
          ref={filterScrollRef}
          onTouchStart={() => {
            if (animFrameRef.current !== null) {
              cancelAnimationFrame(animFrameRef.current);
              animFrameRef.current = null;
            }
          }}
          className="inline-flex p-1 bg-stone-100/90 rounded-full border border-stone-200/70 overflow-x-auto no-scrollbar gap-1 max-w-full justify-start sm:justify-center"
        >
          <button
            type="button"
            onClick={() => handleCategorySelect('all', 0)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all shrink-0",
              activeCategory === 'all'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            All Planners
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('investment', 1)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all shrink-0",
              activeCategory === 'investment'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            SIP / Lump Sum
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('education', 2)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all shrink-0",
              activeCategory === 'education'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Child Education
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('retirement', 3)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all shrink-0",
              activeCategory === 'retirement'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Retirement
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('marriage', 4)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all shrink-0",
              activeCategory === 'marriage'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Child Marriage
          </button>
        </div>
      </div>

      {/* Calculator Cards */}
      <div className="space-y-8 sm:space-y-10">
        {/* Investment Calculator */}
        {(activeCategory === 'all' || activeCategory === 'investment') && (
          <div id="investment-calculator" className="scroll-mt-28">
            <InvestmentCalculator />
          </div>
        )}

        {/* Child Education Calculator */}
        {(activeCategory === 'all' || activeCategory === 'education') && (
          <div id="child-education-calculator" className="scroll-mt-28">
            <ChildEducationCalculatorWithToggle />
          </div>
        )}

        {/* Income Planning Calculator */}
        {(activeCategory === 'all' || activeCategory === 'retirement') && (
          <div id="income-planning-calculator" className="scroll-mt-28">
            <RetirementPlanner />
          </div>
        )}

        {/* Marriage Expense Planner */}
        {(activeCategory === 'all' || activeCategory === 'marriage') && (
          <div id="child-marriage-calculator" className="scroll-mt-28">
            <ChildMarriageCalculator />
          </div>
        )}
      </div>



      {/* Cross-Navigation Next Step (Borderless & Airy) */}
      <div className="mt-8 sm:mt-10 pt-2 sm:pt-4 text-center">
        <p className="text-xs sm:text-sm text-stone-500">
          Ready to start investing toward your goals?
        </p>
        <Link 
          href="/invest" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 mt-1.5 transition-colors group"
        >
          <span>Explore Mutual Fund Investments</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}