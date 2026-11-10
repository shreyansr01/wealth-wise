"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { ChildEducationCalculatorCard } from "@/components/calculators/child-education-calculator-card";
import { cn } from "@/lib/utils";

export function ChildEducationCalculatorToggle({ 
  calculatorType, 
  onCalculatorTypeChange 
}: { 
  calculatorType: string; 
  onCalculatorTypeChange: (type: string) => void; 
}) {
  return (
    <div className="inline-flex p-1 bg-stone-100/90 rounded-full border border-stone-200/70 gap-1 shadow-2xs">
      <button
        type="button"
        onClick={() => onCalculatorTypeChange("sip")}
        className={cn(
          "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all",
          calculatorType === "sip"
            ? "bg-white text-stone-900 shadow-2xs font-semibold"
            : "text-stone-600 hover:text-stone-900"
        )}
      >
        SIP
      </button>
      <button
        type="button"
        onClick={() => onCalculatorTypeChange("sip-swp")}
        className={cn(
          "px-3.5 py-1.5 text-xs rounded-full font-medium transition-all",
          calculatorType === "sip-swp"
            ? "bg-white text-stone-900 shadow-2xs font-semibold"
            : "text-stone-600 hover:text-stone-900"
        )}
      >
        SIP + SWP
      </button>
    </div>
  );
}

export function ChildEducationCalculatorWithToggle() {
  const [calculatorType, setCalculatorType] = useState("sip");

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <div className="flex justify-center">
        <ChildEducationCalculatorToggle 
          calculatorType={calculatorType} 
          onCalculatorTypeChange={setCalculatorType} 
        />
      </div>
      <ChildEducationCalculator 
        calculatorType={calculatorType} 
      />
    </div>
  );
}

export default function ChildEducationCalculator({ 
  calculatorType
}: { 
  calculatorType?: string;
}) {
  const [internalCalculatorType] = useState("sip");
  const effectiveCalculatorType = calculatorType !== undefined ? calculatorType : internalCalculatorType;

  return (
    <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 overflow-hidden text-left">
      <div className="py-3.5 px-5 sm:py-4 sm:px-6 border-b border-stone-100 bg-stone-50/50 flex flex-row items-center justify-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-emerald-800 border border-stone-200/60 flex items-center justify-center">
          <BookOpen className="h-4 w-4" />
        </div>
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
          Child Education Planner
        </h3>
      </div>
      <div className="p-4 sm:p-7">
        <div className="w-full">
          <ChildEducationCalculatorCard calculatorType={effectiveCalculatorType} key={effectiveCalculatorType} />
        </div>
      </div>
    </div>
  );
}
