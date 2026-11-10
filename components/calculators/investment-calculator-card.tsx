import { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormattedInput } from "@/components/ui/formatted-input";
import { Slider } from "@/components/ui/slider";
import { formatLargeNumber } from "@/lib/format-large-number";
import { calculateSIP, calculateLumpsum, calculateSWP, CalculationResult, SWPResult } from "@/lib/calculators";
import { RotateCcw, CircleDollarSign, CreditCard } from "lucide-react";

// Piecewise-linear mappings for sliders
const sipValToPos = (val: number): number => {
  if (val <= 500) return 0;
  if (val >= 1000000) return 100;
  if (val <= 50000) return ((val - 500) / 49500) * 50;
  return 50 + ((val - 50000) / 950000) * 50;
};
const sipPosToVal = (pos: number): number => {
  if (pos <= 0) return 500;
  if (pos >= 100) return 1000000;
  if (pos <= 50) {
    const val = 500 + (pos / 50) * 49500;
    return Math.round(val / 500) * 500;
  }
  const val = 50000 + ((pos - 50) / 50) * 950000;
  return Math.round(val / 5000) * 5000;
};

const lumpValToPos = (val: number): number => {
  if (val <= 1000) return 0;
  if (val >= 10000000) return 100;
  if (val <= 1000000) return ((val - 1000) / 999000) * 50;
  return 50 + ((val - 1000000) / 9000000) * 50;
};
const lumpPosToVal = (pos: number): number => {
  if (pos <= 0) return 1000;
  if (pos >= 100) return 10000000;
  if (pos <= 50) {
    const val = 1000 + (pos / 50) * 999000;
    return Math.round(val / 1000) * 1000;
  }
  const val = 1000000 + ((pos - 50) / 50) * 9000000;
  return Math.round(val / 50000) * 50000;
};

const swpInvValToPos = (val: number): number => {
  if (val <= 10000) return 0;
  if (val >= 10000000) return 100;
  if (val <= 1000000) return ((val - 10000) / 990000) * 50;
  return 50 + ((val - 1000000) / 9000000) * 50;
};
const swpInvPosToVal = (pos: number): number => {
  if (pos <= 0) return 10000;
  if (pos >= 100) return 10000000;
  if (pos <= 50) {
    const val = 10000 + (pos / 50) * 990000;
    return Math.round(val / 10000) * 10000;
  }
  const val = 1000000 + ((pos - 50) / 50) * 9000000;
  return Math.round(val / 50000) * 50000;
};

const swpWdValToPos = (val: number): number => {
  if (val <= 500) return 0;
  if (val >= 250000) return 100;
  if (val <= 25000) return ((val - 500) / 24500) * 50;
  return 50 + ((val - 25000) / 225000) * 50;
};
const swpWdPosToVal = (pos: number): number => {
  if (pos <= 0) return 500;
  if (pos >= 100) return 250000;
  if (pos <= 50) {
    const val = 500 + (pos / 50) * 24500;
    return Math.round(val / 500) * 500;
  }
  const val = 25000 + ((pos - 50) / 50) * 225000;
  return Math.round(val / 2500) * 2500;
};

export function InvestmentCalculatorCard({ investmentType }: { investmentType: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [totalInvestment, setTotalInvestment] = useState("100000");
  const [investmentAmount, setInvestmentAmount] = useState("5000");
  const [withdrawalAmount, setWithdrawalAmount] = useState("5000");
  const [expectedReturnRate, setExpectedReturnRate] = useState("12");
  const [timePeriod, setTimePeriod] = useState("10");

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (investmentType === "sip") {
      const amt = parseFloat(investmentAmount);
      if (investmentAmount !== "") {
        if (isNaN(amt)) errs.investmentAmount = "Enter a valid amount";
        else if (amt < 100 || amt > 10000000) errs.investmentAmount = "Amount between ₹100 and ₹1 Crore";
      }
    }

    if (investmentType === "lumpsum") {
      const tot = parseFloat(totalInvestment);
      if (totalInvestment !== "") {
        if (isNaN(tot)) errs.totalInvestment = "Enter a valid amount";
        else if (tot < 100 || tot > 100000000) errs.totalInvestment = "Amount between ₹100 and ₹10 Crores";
      }
    }

    if (investmentType === "swp") {
      const tot = parseFloat(totalInvestment);
      if (totalInvestment !== "") {
        if (isNaN(tot)) errs.totalInvestment = "Enter a valid amount";
        else if (tot < 1000 || tot > 100000000) errs.totalInvestment = "Amount between ₹1,000 and ₹10 Crores";
      }

      const wd = parseFloat(withdrawalAmount);
      if (withdrawalAmount !== "") {
        if (isNaN(wd)) errs.withdrawalAmount = "Enter a valid amount";
        else if (wd < 100 || wd > 10000000) errs.withdrawalAmount = "Withdrawal between ₹100 and ₹1 Crore";
        else if (!isNaN(tot) && wd > tot) errs.withdrawalAmount = "Withdrawal cannot exceed initial investment";
      }
    }

    const rate = parseFloat(expectedReturnRate);
    if (expectedReturnRate !== "") {
      if (isNaN(rate)) errs.expectedReturnRate = "Enter a valid rate";
      else if (rate < 0.1 || rate > 50) errs.expectedReturnRate = "Rate between 0.1% and 50%";
    }

    const yrs = parseInt(timePeriod);
    if (timePeriod !== "") {
      if (isNaN(yrs)) errs.timePeriod = "Enter a valid number of years";
      else if (yrs < 1 || yrs > 40) errs.timePeriod = "Period between 1 and 40 years";
    }

    return errs;
  }, [investmentType, investmentAmount, totalInvestment, withdrawalAmount, expectedReturnRate, timePeriod]);

  const calculatedResult: CalculationResult | SWPResult | null = useMemo(() => {
    if (Object.keys(errors).length > 0) return null;
    if (expectedReturnRate === "" || timePeriod === "") return null;
    if (investmentType === "sip" && investmentAmount === "") return null;
    if (investmentType === "lumpsum" && totalInvestment === "") return null;
    if (investmentType === "swp" && (totalInvestment === "" || withdrawalAmount === "")) return null;

    const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

    let principal = parseFloat(totalInvestment);
    if (isNaN(principal)) principal = 100000;
    principal = clamp(principal, 100, 100000000);

    let monthlyAmt = parseFloat(investmentAmount);
    if (isNaN(monthlyAmt)) monthlyAmt = 5000;
    monthlyAmt = clamp(monthlyAmt, 100, 10000000);

    let withdrawalAmt = parseFloat(withdrawalAmount);
    if (isNaN(withdrawalAmt)) withdrawalAmt = 5000;
    withdrawalAmt = clamp(withdrawalAmt, 100, Math.min(10000000, principal));

    let annualRate = parseFloat(expectedReturnRate);
    if (isNaN(annualRate)) annualRate = 12;
    annualRate = clamp(annualRate, 0.1, 50);

    let years = parseInt(timePeriod);
    if (isNaN(years)) years = 10;
    years = clamp(years, 1, 40);

    if (investmentType === "sip") return calculateSIP(monthlyAmt, annualRate, years);
    if (investmentType === "lumpsum") return calculateLumpsum(principal, annualRate, years);
    if (investmentType === "swp") return calculateSWP(principal, withdrawalAmt, annualRate, years);

    return null;
  }, [totalInvestment, investmentAmount, withdrawalAmount, expectedReturnRate, timePeriod, investmentType, errors]);

  const investedValue = Math.max(0, calculatedResult ? calculatedResult.totalInvested : 0);
  const gainsValue = Math.max(0, calculatedResult ? calculatedResult.wealthGained : 0);
  const totalChartValue = investedValue + gainsValue;

  const investedColor = "#94a3b8"; // Clean modern slate-400
  const gainsColor = "#10b981"; // Luminous, vibrant emerald-500
  const donutSize = 220;
  const r = 70;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 overflow-hidden text-left">
      <div className="py-3.5 px-5 sm:py-4 sm:px-6 border-b border-stone-100 bg-stone-50/50 flex flex-row items-center justify-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-emerald-800 border border-stone-200/60 flex items-center justify-center">
          {investmentType === "sip" && <RotateCcw className="h-4 w-4" />}
          {investmentType === "lumpsum" && <CircleDollarSign className="h-4 w-4" />}
          {investmentType === "swp" && <CreditCard className="h-4 w-4" />}
        </div>
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
          {investmentType === "sip" && "SIP Return Estimator"}
          {investmentType === "lumpsum" && "Lump Sum Return Estimator"}
          {investmentType === "swp" && "SWP Cash Flow Estimator"}
        </h3>
      </div>

      <div className="p-4 sm:p-7">
        <div className="space-y-5 sm:space-y-7">
          {investmentType === "sip" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <Label htmlFor="investmentAmount" className="text-xs sm:text-sm font-semibold text-stone-700">Monthly SIP Amount (₹)</Label>
                <FormattedInput
                  id="investmentAmount"
                  inputMode="numeric"
                  value={investmentAmount}
                  onFormattedChange={setInvestmentAmount}
                  className="w-32 sm:w-44 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
                />
              </div>
              {errors.investmentAmount && (
                <p className="text-red-500 text-xs">{errors.investmentAmount}</p>
              )}
              <Slider value={[sipValToPos(Number(investmentAmount) || 0)]} onValueChange={([v]) => setInvestmentAmount(String(sipPosToVal(v)))} min={0} max={100} step={1} className="w-full pt-1" />
            </div>
          )}

          {investmentType === "lumpsum" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <Label htmlFor="totalInvestment" className="text-xs sm:text-sm font-semibold text-stone-700">Total Investment (₹)</Label>
                <FormattedInput
                  id="totalInvestment"
                  inputMode="numeric"
                  value={totalInvestment}
                  onFormattedChange={setTotalInvestment}
                  className="w-32 sm:w-44 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
                />
              </div>
              {errors.totalInvestment && (
                <p className="text-red-500 text-xs">{errors.totalInvestment}</p>
              )}
              <Slider value={[lumpValToPos(Number(totalInvestment) || 0)]} onValueChange={([v]) => setTotalInvestment(String(lumpPosToVal(v)))} min={0} max={100} step={1} className="w-full pt-1" />
            </div>
          )}

          {investmentType === "swp" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <Label htmlFor="totalInvestment" className="text-xs sm:text-sm font-semibold text-stone-700">Initial Corpus (₹)</Label>
                  <FormattedInput
                    id="totalInvestment"
                    inputMode="numeric"
                    value={totalInvestment}
                    onFormattedChange={setTotalInvestment}
                    className="w-32 sm:w-44 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
                  />
                </div>
                {errors.totalInvestment && (
                  <p className="text-red-500 text-xs">{errors.totalInvestment}</p>
                )}
                <Slider value={[swpInvValToPos(Number(totalInvestment) || 0)]} onValueChange={([v]) => setTotalInvestment(String(swpInvPosToVal(v)))} min={0} max={100} step={1} className="w-full pt-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <Label htmlFor="withdrawalAmount" className="text-xs sm:text-sm font-semibold text-stone-700">Monthly Withdrawal (₹)</Label>
                  <FormattedInput
                    id="withdrawalAmount"
                    inputMode="numeric"
                    value={withdrawalAmount}
                    onFormattedChange={setWithdrawalAmount}
                    className="w-32 sm:w-44 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
                  />
                </div>
                {errors.withdrawalAmount && (
                  <p className="text-red-500 text-xs">{errors.withdrawalAmount}</p>
                )}
                <Slider value={[swpWdValToPos(Number(withdrawalAmount) || 0)]} onValueChange={([v]) => setWithdrawalAmount(String(swpWdPosToVal(v)))} min={0} max={100} step={1} className="w-full pt-1" />
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <Label htmlFor="expectedReturnRate" className="text-xs sm:text-sm font-semibold text-stone-700">Expected Annual Return (% p.a.)</Label>
              <Input
                id="expectedReturnRate"
                inputMode="decimal"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(e.target.value)}
                className="w-20 sm:w-28 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
              />
            </div>
            {errors.expectedReturnRate && (
              <p className="text-red-500 text-xs">{errors.expectedReturnRate}</p>
            )}
            <Slider value={[Number(expectedReturnRate) || 0]} onValueChange={([v]) => setExpectedReturnRate(String(v))} min={1} max={30} step={0.5} className="w-full pt-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <Label htmlFor="timePeriod" className="text-xs sm:text-sm font-semibold text-stone-700">Time Horizon (Years)</Label>
              <Input
                id="timePeriod"
                inputMode="numeric"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-20 sm:w-28 text-right rounded-xl border-stone-200 bg-stone-50/60 font-semibold text-stone-900 focus:border-emerald-600 focus:ring-emerald-600/10 text-base sm:text-sm py-1.5 h-9"
              />
            </div>
            {errors.timePeriod && (
              <p className="text-red-500 text-xs">{errors.timePeriod}</p>
            )}
            <Slider value={[Number(timePeriod) || 0]} onValueChange={([v]) => setTimePeriod(String(v))} min={1} max={40} step={1} className="w-full pt-1" />
          </div>

          {/* Results Block */}
          {calculatedResult && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/70">
                {/* Left: Donut Chart */}
                <div className="md:col-span-5 flex justify-center">
                  {!isMounted ? (
                    <div className="w-40 h-40 rounded-full bg-stone-100 animate-pulse" />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="w-36 h-36 sm:w-44 sm:h-44">
                        {totalChartValue > 0 && (() => {
                          const investedLen = (investedValue / totalChartValue) * circumference;
                          const gainsLen = circumference - investedLen;
                          return (
                            <g transform={`translate(${donutSize / 2}, ${donutSize / 2}) rotate(-90)`}>
                              <circle r={r} fill="none" stroke="#e7e5e4" strokeWidth={strokeWidth} />
                              <circle
                                r={r}
                                fill="none"
                                stroke={investedColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${investedLen} ${circumference - investedLen}`}
                                strokeDashoffset={0}
                              />
                              <circle
                                r={r}
                                fill="none"
                                stroke={gainsColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${gainsLen} ${circumference - gainsLen}`}
                                strokeDashoffset={-investedLen}
                              />
                            </g>
                          );
                        })()}
                      </svg>
                    </div>
                  )}
                </div>

                {/* Right: Numbers Summary */}
                <div className="md:col-span-7 flex flex-col justify-center gap-3 text-left font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: investedColor }} />
                      <span className="text-xs sm:text-[13px] text-stone-600 font-medium">Total invested</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-stone-900">{formatLargeNumber(investedValue)}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: gainsColor }} />
                      <span className="text-xs sm:text-[13px] text-stone-600 font-medium">
                        {investmentType === "swp" ? "Total withdrawn" : "Estimated returns"}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-emerald-700">
                      {formatLargeNumber(investmentType === "swp" ? (calculatedResult as SWPResult).totalWithdrawn : gainsValue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900">
                      {investmentType === "swp" ? "Projected final balance" : "Projected maturity value"}
                    </span>
                    <span className="text-lg sm:text-2xl font-bold font-sans text-stone-900 tracking-tight">
                      {formatLargeNumber(
                        investmentType === "swp"
                          ? (calculatedResult as SWPResult).finalBalance
                          : (calculatedResult as CalculationResult).futureValue
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}