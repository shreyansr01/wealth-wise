"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormattedInput } from "@/components/ui/formatted-input";
import { Button } from "@/components/ui/button";
import { formatLargeNumber } from "@/lib/format-large-number";
import { calculateEducationPlan } from "@/lib/calculators";
import { CheckCircle, Calendar, CircleDollarSign, Info, MessageCircle, Clock } from "lucide-react";

interface SipCalculationResults {
  projectedCost: number;
  monthlyInvestment: number;
  yearsUntilEducation: number;
}

interface SipSwpCalculationResults {
  yearlyAmount: number;
  careerFund: number;
  startYear: number;
  educationYears: number;
  finalYear: number;
}

export function ChildEducationCalculatorCard({ calculatorType }: { calculatorType: string }) {
  // SIP states
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [educationStartAge, setEducationStartAge] = useState("");
  const [presentCost, setPresentCost] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [amountSaved, setAmountSaved] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");

  // SIP+SWP states
  const [monthlySavings, setMonthlySavings] = useState("");
  const [paymentDuration, setPaymentDuration] = useState<"10" | "15">("10");

  const [showResults, setShowResults] = useState(false);

  // Validation checks
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (calculatorType === "sip") {
      const age = parseInt(childAge);
      if (childAge !== "") {
        if (isNaN(age)) errs.childAge = "Enter a valid age";
        else if (age < 0 || age > 30) errs.childAge = "Age must be between 0 and 30 years";
      }

      const startAge = parseInt(educationStartAge);
      if (educationStartAge !== "") {
        if (isNaN(startAge)) errs.educationStartAge = "Enter a valid age";
        else if (startAge < 10 || startAge > 35) errs.educationStartAge = "Age must be between 10 and 35 years";
        else if (!isNaN(age) && startAge <= age) errs.educationStartAge = "Must be greater than current age";
      }

      const cost = parseFloat(presentCost);
      if (presentCost !== "") {
        if (isNaN(cost)) errs.presentCost = "Enter a valid amount";
        else if (cost < 10000 || cost > 100000000) errs.presentCost = "Amount between ₹10,000 and ₹10 Crores";
      }

      const inf = parseFloat(inflationRate);
      if (inflationRate !== "") {
        if (isNaN(inf)) errs.inflationRate = "Enter a valid rate";
        else if (inf < 0 || inf > 30) errs.inflationRate = "Inflation between 0% and 30%";
      }

      const saved = parseFloat(amountSaved);
      if (amountSaved !== "") {
        if (isNaN(saved)) errs.amountSaved = "Enter a valid amount";
        else if (saved < 0 || saved > 100000000) errs.amountSaved = "Amount between ₹0 and ₹10 Crores";
      }

      const ret = parseFloat(expectedReturn);
      if (expectedReturn !== "") {
        if (isNaN(ret)) errs.expectedReturn = "Enter a valid rate";
        else if (ret < 0 || ret > 30) errs.expectedReturn = "Rate between 0% and 30%";
      }
    } else if (calculatorType === "sip-swp") {
      const savings = parseFloat(monthlySavings);
      if (monthlySavings !== "") {
        if (isNaN(savings)) errs.monthlySavings = "Enter a valid amount";
        else if (savings < 500 || savings > 5000000) errs.monthlySavings = "Savings between ₹500 and ₹50 Lakhs";
      }
    }

    return errs;
  }, [calculatorType, childName, childAge, educationStartAge, presentCost, inflationRate, amountSaved, expectedReturn, monthlySavings, showResults]);

  const sipCalculationResults = useMemo<SipCalculationResults | null>(() => {
    if (calculatorType !== "sip") return null;
    if (Object.keys(errors).length > 0) return null;
    if (!childAge || !educationStartAge || !presentCost || !inflationRate || !expectedReturn) return null;

    const age = parseInt(childAge);
    const startAge = parseInt(educationStartAge);
    const cost = parseFloat(presentCost);
    const inf = parseFloat(inflationRate);
    const saved = amountSaved ? parseFloat(amountSaved) : 0;
    const ret = parseFloat(expectedReturn);
    const yearsUntilEducation = Math.max(1, startAge - age);

    const result = calculateEducationPlan(cost, inf, yearsUntilEducation, saved, ret);
    return {
      projectedCost: result.projectedCost,
      monthlyInvestment: result.monthlyInvestment,
      yearsUntilEducation: result.yearsUntilEducation,
    };
  }, [calculatorType, childAge, educationStartAge, presentCost, inflationRate, amountSaved, expectedReturn, errors]);

  const sipSwpCalculationResults = useMemo<SipSwpCalculationResults | null>(() => {
    if (calculatorType !== "sip-swp") return null;
    if (Object.keys(errors).length > 0) return null;
    if (!monthlySavings) return null;

    const savings = parseFloat(monthlySavings);
    const duration = parseInt(paymentDuration);

    if (duration === 10) {
      return {
        yearlyAmount: Math.round(savings * 1.5),
        careerFund: Math.round(savings * 25),
        startYear: 18,
        educationYears: 4,
        finalYear: 22,
      };
    } else {
      return {
        yearlyAmount: Math.round(savings * 2),
        careerFund: Math.round(savings * 35),
        startYear: 18,
        educationYears: 4,
        finalYear: 22,
      };
    }
  }, [calculatorType, monthlySavings, paymentDuration, errors]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleShareSip = () => {
    if (!sipCalculationResults) return;
    const { projectedCost, monthlyInvestment, yearsUntilEducation } = sipCalculationResults;

    const shareTitle = childName.trim() ? `Child Education Plan for ${childName}` : "Child Education Plan";
    const shareText = `${shareTitle}:
Estimated Cost in ${yearsUntilEducation} years: ${formatLargeNumber(projectedCost)}
Required Monthly SIP: ${formatLargeNumber(monthlyInvestment)}`;

    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleShareSipSwp = () => {
    if (!sipSwpCalculationResults) return;
    const { yearlyAmount, careerFund, educationYears } = sipSwpCalculationResults;

    const shareTitle = childName.trim() ? `Higher Education Support Plan for ${childName}` : "Higher Education Support Plan";
    const shareTextContent = `${shareTitle}:
Yearly Support: ${formatLargeNumber(yearlyAmount)}/year (for ${educationYears} years)
End Career Fund: ${formatLargeNumber(careerFund)}`;

    const encodedText = encodeURIComponent(shareTextContent);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const renderSipResults = () => {
    if (!sipCalculationResults) return null;
    const { monthlyInvestment, yearsUntilEducation, projectedCost } = sipCalculationResults;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2">
            <span className="text-stone-500 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">Projected Cost</span>
            <span className="text-base sm:text-xl font-bold text-stone-900 font-sans">
              {formatLargeNumber(projectedCost)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">In {yearsUntilEducation} years</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 border-l border-stone-200/60">
            <span className="text-stone-500 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">Monthly SIP Needed</span>
            <span className="text-base sm:text-xl font-bold text-emerald-800 font-sans">
              {formatLargeNumber(monthlyInvestment)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-700/80 mt-0.5">To reach goal</span>
          </div>
        </div>

        {monthlyInvestment > 0 ? (
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Invest <span className="font-bold text-stone-900">{formatLargeNumber(monthlyInvestment)}</span> every month for the next <span className="font-bold">{yearsUntilEducation} years</span> to meet your child&apos;s higher education goal.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 text-left">
            <p className="text-xs sm:text-sm text-emerald-900 font-medium">
              Your current savings are sufficient to meet this education milestone.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderSipSwpResults = () => {
    if (!sipSwpCalculationResults) return null;
    const { yearlyAmount, careerFund, startYear, educationYears, finalYear } = sipSwpCalculationResults;

    return (
      <div className="space-y-4">
        <div className="space-y-2.5">
          {[...Array(educationYears)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <div className="flex items-center gap-2.5 text-stone-700 text-xs sm:text-sm font-medium">
                <Calendar className="h-4 w-4 text-stone-500" />
                <span>Age {startYear + i} Payout</span>
              </div>
              <span className="font-bold text-stone-900 text-sm">{formatLargeNumber(yearlyAmount)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
          <div className="flex items-center gap-2.5 text-emerald-950 text-xs sm:text-sm font-medium">
            <CircleDollarSign className="h-4 w-4 text-emerald-700" />
            <span>Career Fund (at age {finalYear})</span>
          </div>
          <span className="font-bold text-emerald-900 text-base">{formatLargeNumber(careerFund)}</span>
        </div>

        <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/50 flex items-center gap-2.5 text-[11px] text-stone-500">
          <Info className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <span>Based on regular monthly investments followed by annual withdrawals for college fees.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full text-left">
      {calculatorType === "sip" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="childName" className="text-xs sm:text-sm font-semibold text-stone-700">Child&apos;s Name (Optional)</Label>
            <Input
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g., Arjun"
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="childAge" className="text-xs sm:text-sm font-semibold text-stone-700">Current Age</Label>
              <FormattedInput
                id="childAge"
                inputMode="numeric"
                value={childAge}
                onFormattedChange={setChildAge}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 5"
              />
              {errors.childAge && <p className="text-red-500 text-xs">{errors.childAge}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="educationStartAge" className="text-xs sm:text-sm font-semibold text-stone-700">College Age</Label>
              <FormattedInput
                id="educationStartAge"
                inputMode="numeric"
                value={educationStartAge}
                onFormattedChange={setEducationStartAge}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 18"
              />
              {errors.educationStartAge && <p className="text-red-500 text-xs">{errors.educationStartAge}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="presentCost" className="text-xs sm:text-sm font-semibold text-stone-700">Present Cost of Degree / Course (₹)</Label>
            <FormattedInput
              id="presentCost"
              inputMode="numeric"
              value={presentCost}
              onFormattedChange={setPresentCost}
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
              placeholder="e.g., 1200000"
            />
            {errors.presentCost && <p className="text-red-500 text-xs">{errors.presentCost}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inflationRate" className="text-xs sm:text-sm font-semibold text-stone-700">Inflation (% p.a.)</Label>
              <FormattedInput
                id="inflationRate"
                inputMode="decimal"
                value={inflationRate}
                onFormattedChange={setInflationRate}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 8"
              />
              {errors.inflationRate && <p className="text-red-500 text-xs">{errors.inflationRate}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expectedReturn" className="text-xs sm:text-sm font-semibold text-stone-700">Return (% p.a.)</Label>
              <FormattedInput
                id="expectedReturn"
                inputMode="decimal"
                value={expectedReturn}
                onFormattedChange={setExpectedReturn}
                className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
                placeholder="e.g., 12"
              />
              {errors.expectedReturn && <p className="text-red-500 text-xs">{errors.expectedReturn}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amountSaved" className="text-xs sm:text-sm font-semibold text-stone-700">Amount Already Saved (₹)</Label>
            <FormattedInput
              id="amountSaved"
              inputMode="numeric"
              value={amountSaved}
              onFormattedChange={setAmountSaved}
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
              placeholder="e.g., 100000"
            />
            {errors.amountSaved && <p className="text-red-500 text-xs">{errors.amountSaved}</p>}
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs"
            disabled={!childAge || !educationStartAge || !presentCost || !inflationRate || !expectedReturn || Object.keys(errors).length > 0}
          >
            Calculate Education Goal
          </Button>

          {showResults && sipCalculationResults && (
            <div className="mt-6 pt-5 border-t border-stone-100 space-y-4">
              {renderSipResults()}

              <Button
                onClick={handleShareSip}
                className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Share on WhatsApp
              </Button>
            </div>
          )}
        </>
      )}

      {calculatorType === "sip-swp" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="childNameSwp" className="text-xs sm:text-sm font-semibold text-stone-700">Child&apos;s Name (Optional)</Label>
            <Input
              id="childNameSwp"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g., Priya"
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="monthlySavings" className="text-xs sm:text-sm font-semibold text-stone-700">Planned Monthly Investment (₹)</Label>
            <FormattedInput
              id="monthlySavings"
              inputMode="numeric"
              value={monthlySavings}
              onFormattedChange={setMonthlySavings}
              className="rounded-xl border-stone-200 bg-stone-50/60 font-medium text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-2 h-10"
              placeholder="e.g., 5000"
            />
            {errors.monthlySavings && <p className="text-red-500 text-xs">{errors.monthlySavings}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-semibold text-stone-700">Investment Horizon</Label>
            <div className="flex p-1 bg-stone-100/90 border border-stone-200/70 rounded-full w-full gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setPaymentDuration("10")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  paymentDuration === "10"
                    ? "bg-white text-stone-900 font-semibold shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                10 Years
              </button>
              <button
                type="button"
                onClick={() => setPaymentDuration("15")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  paymentDuration === "15"
                    ? "bg-white text-stone-900 font-semibold shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                15 Years
              </button>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs"
            disabled={!monthlySavings || Object.keys(errors).length > 0}
          >
            Calculate Education Plan
          </Button>

          {showResults && sipSwpCalculationResults && (
            <div className="mt-6 pt-5 border-t border-stone-100 space-y-4">
              {renderSipSwpResults()}

              <Button
                onClick={handleShareSipSwp}
                className="w-full py-2.5 h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Share on WhatsApp
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}