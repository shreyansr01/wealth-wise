"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormattedInput } from "@/components/ui/formatted-input";
import { Button } from "@/components/ui/button";
import { formatLargeNumber } from "@/lib/format-large-number";
import { calculateRetirementPlan, RetirementPlanResult } from "@/lib/calculators";
import { Umbrella, MessageCircle, CheckCircle } from "lucide-react";

export default function RetirementPlanner() {
  const [name, setName] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Validation checks
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    const current = parseInt(currentAge);
    if (currentAge !== "") {
      if (isNaN(current)) errs.currentAge = "Enter a valid age";
      else if (current < 15 || current > 99) errs.currentAge = "Current age must be between 15 and 99 years";
    }

    const retirement = parseInt(retirementAge);
    if (retirementAge !== "") {
      if (isNaN(retirement)) errs.retirementAge = "Enter a valid age";
      else if (retirement < 15 || retirement > 100) errs.retirementAge = "Retirement age must be between 15 and 100 years";
      else if (!isNaN(current) && retirement <= current) errs.retirementAge = "Retirement age must be greater than current age";
    }

    const expectancy = parseInt(lifeExpectancy);
    if (lifeExpectancy !== "") {
      if (isNaN(expectancy)) errs.lifeExpectancy = "Enter a valid life expectancy";
      else if (expectancy < 15 || expectancy > 120) errs.lifeExpectancy = "Life expectancy must be between 15 and 120 years";
      else if (!isNaN(retirement) && expectancy <= retirement) errs.lifeExpectancy = "Life expectancy must be greater than retirement age";
    }

    const expenses = parseFloat(monthlyExpenses);
    if (monthlyExpenses !== "") {
      if (isNaN(expenses)) errs.monthlyExpenses = "Enter a valid amount";
      else if (expenses < 100 || expenses > 5000000) errs.monthlyExpenses = "Expenses should be between ₹100 and ₹50 Lakhs";
    }

    const inf = parseFloat(inflationRate);
    if (inflationRate !== "") {
      if (isNaN(inf)) errs.inflationRate = "Enter a valid rate";
      else if (inf < 0 || inf > 30) errs.inflationRate = "Inflation rate between 0% and 30%";
    }

    const ret = parseFloat(expectedReturn);
    if (expectedReturn !== "") {
      if (isNaN(ret)) errs.expectedReturn = "Enter a valid rate";
      else if (ret < 0 || ret > 30) errs.expectedReturn = "Rate of return between 0% and 30%";
    }

    return errs;
  }, [name, currentAge, retirementAge, lifeExpectancy, monthlyExpenses, inflationRate, expectedReturn, showResults]);

  const calculationResults = useMemo<RetirementPlanResult | null>(() => {
    if (Object.keys(errors).length > 0) return null;
    if (!currentAge || !retirementAge || !lifeExpectancy || !monthlyExpenses || !inflationRate || !expectedReturn) return null;

    const current = parseInt(currentAge);
    const retirement = parseInt(retirementAge);
    const expectancy = parseInt(lifeExpectancy);
    const expenses = parseFloat(monthlyExpenses);
    const inf = parseFloat(inflationRate);
    const ret = parseFloat(expectedReturn);

    return calculateRetirementPlan(current, retirement, expectancy, expenses, inf, ret);
  }, [currentAge, retirementAge, lifeExpectancy, monthlyExpenses, inflationRate, expectedReturn, errors]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const renderResults = () => {
    if (!calculationResults) return null;
    const { retirementCorpus, monthlySavingsRequired, yearsUntilRetirement, futureMonthlyExpenses } = calculationResults;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2">
            <span className="text-stone-500 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">Years to Retire</span>
            <span className="text-base sm:text-lg font-bold text-stone-900">{yearsUntilRetirement} Years</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 border-t sm:border-t-0 sm:border-l border-stone-200/60">
            <span className="text-stone-500 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">Target Corpus Needed</span>
            <span className="text-base sm:text-lg font-bold text-stone-900">{formatLargeNumber(retirementCorpus)}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 border-t sm:border-t-0 sm:border-l border-stone-200/60">
            <span className="text-stone-500 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">Required Monthly SIP</span>
            <span className="text-base sm:text-lg font-bold text-emerald-800">{formatLargeNumber(monthlySavingsRequired)}</span>
          </div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              To sustain projected living expenses of <span className="font-bold text-stone-900">{formatLargeNumber(futureMonthlyExpenses)}/month</span> post-retirement, aim to invest <span className="font-bold text-emerald-800">{formatLargeNumber(monthlySavingsRequired)}/month</span> until age {retirementAge}.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleShare = () => {
    if (!calculationResults) return;
    const { retirementCorpus, monthlySavingsRequired, yearsUntilRetirement, futureMonthlyExpenses } = calculationResults;

    const shareTitle = name.trim() ? `Retirement Plan Projection for ${name}` : "Retirement Plan Projection";
    const shareText = `${shareTitle}:
Target Corpus: ${formatLargeNumber(retirementCorpus)}
Required Monthly SIP: ${formatLargeNumber(monthlySavingsRequired)}
Time to Retirement: ${yearsUntilRetirement} years
Projected Monthly Expense at Retirement: ${formatLargeNumber(futureMonthlyExpenses)}/month`;

    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 overflow-hidden text-left">
      <div className="py-3.5 px-5 sm:py-4 sm:px-6 border-b border-stone-100 bg-stone-50/50 flex flex-row items-center justify-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-emerald-800 border border-stone-200/60 flex items-center justify-center">
          <Umbrella className="h-4 w-4" />
        </div>
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
          Retirement Income Planner
        </h3>
      </div>

      <div className="p-4 sm:p-7">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="retirementPlannerName" className="text-xs sm:text-sm font-semibold text-stone-700">Your Name (Optional)</Label>
            <Input
              id="retirementPlannerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Shreyan"
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="retirementPlannerCurrentAge" className="text-[11px] sm:text-xs font-semibold text-stone-700 truncate block">Current Age</Label>
              <FormattedInput
                id="retirementPlannerCurrentAge"
                inputMode="numeric"
                value={currentAge}
                onFormattedChange={setCurrentAge}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 30"
              />
              {errors.currentAge && <p className="text-red-500 text-xs">{errors.currentAge}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retirementPlannerRetirementAge" className="text-[11px] sm:text-xs font-semibold text-stone-700 truncate block">Retirement Age</Label>
              <FormattedInput
                id="retirementPlannerRetirementAge"
                inputMode="numeric"
                value={retirementAge}
                onFormattedChange={setRetirementAge}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 60"
              />
              {errors.retirementAge && <p className="text-red-500 text-xs">{errors.retirementAge}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retirementPlannerLifeExpectancy" className="text-[11px] sm:text-xs font-semibold text-stone-700 truncate block">Life Expectancy</Label>
              <FormattedInput
                id="retirementPlannerLifeExpectancy"
                inputMode="numeric"
                value={lifeExpectancy}
                onFormattedChange={setLifeExpectancy}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 85"
              />
              {errors.lifeExpectancy && <p className="text-red-500 text-xs">{errors.lifeExpectancy}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="retirementPlannerMonthlyExpenses" className="text-xs sm:text-sm font-semibold text-stone-700">Current Monthly Living Expenses (₹)</Label>
            <FormattedInput
              id="retirementPlannerMonthlyExpenses"
              inputMode="numeric"
              value={monthlyExpenses}
              onFormattedChange={setMonthlyExpenses}
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
              placeholder="e.g., 50000"
            />
            {errors.monthlyExpenses && <p className="text-red-500 text-xs">{errors.monthlyExpenses}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="retirementPlannerInflationRate" className="text-xs sm:text-sm font-semibold text-stone-700">Inflation (% p.a.)</Label>
              <FormattedInput
                id="retirementPlannerInflationRate"
                inputMode="decimal"
                value={inflationRate}
                onFormattedChange={setInflationRate}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 6"
              />
              {errors.inflationRate && <p className="text-red-500 text-xs">{errors.inflationRate}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retirementPlannerExpectedReturn" className="text-xs sm:text-sm font-semibold text-stone-700">Return (% p.a.)</Label>
              <FormattedInput
                id="retirementPlannerExpectedReturn"
                inputMode="decimal"
                value={expectedReturn}
                onFormattedChange={setExpectedReturn}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 12"
              />
              {errors.expectedReturn && <p className="text-red-500 text-xs">{errors.expectedReturn}</p>}
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs"
            disabled={!currentAge || !retirementAge || !lifeExpectancy || !monthlyExpenses || !inflationRate || !expectedReturn || Object.keys(errors).length > 0}
          >
            Calculate Retirement Plan
          </Button>

          {showResults && calculationResults && (
            <div className="mt-6 pt-5 border-t border-stone-100 space-y-4">
              {renderResults()}

              <Button
                onClick={handleShare}
                className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Share on WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}