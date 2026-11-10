"use client";

import { useState } from "react";
import { InvestmentCalculatorCard } from "@/components/calculators/investment-calculator-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

export default function InvestmentCalculator() {
  const [investmentType, setInvestmentType] = useState("sip");

  const handleInvestmentTypeChange = (type: string) => {
    setInvestmentType(type);
  };

  return (
    <AnimatedSection animation="fade-up" delay={0} duration={350}>
      <div className="w-full max-w-3xl mx-auto space-y-3 font-sans">
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-stone-100/90 rounded-full border border-stone-200/70 gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleInvestmentTypeChange("sip")}
              className={cn(
                "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all",
                investmentType === "sip"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              SIP
            </button>
            <button
              type="button"
              onClick={() => handleInvestmentTypeChange("lumpsum")}
              className={cn(
                "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all",
                investmentType === "lumpsum"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              Lump Sum
            </button>
            <button
              type="button"
              onClick={() => handleInvestmentTypeChange("swp")}
              className={cn(
                "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all",
                investmentType === "swp"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              SWP
            </button>
          </div>
        </div>

        <div>
          <InvestmentCalculatorCard investmentType={investmentType} key={investmentType} />
        </div>
      </div>
    </AnimatedSection>
  );
}
