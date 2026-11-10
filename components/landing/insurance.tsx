'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Bike,
  Car,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  FileText,
} from "lucide-react";
import { SimplePageHeader } from "@/components/ui/simple-page-header";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

interface PremiumRange {
  plan: string;
  cost: string;
}

interface PolicyItem {
  id: string;
  title: string;
  highlights: string[];
  documents: string[];
  process: string[];
  costs: PremiumRange[];
  icon: React.ElementType;
  whatsAppMsg: string;
}

export default function InsuranceContent() {
  const { firstName: clientFirstName } = siteConfig;

  const [activeCategory, setActiveCategory] = useState<'all' | 'health-life' | 'vehicle'>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleDetails = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1).toLowerCase();
        if (id === "health-insurance" || id === "life-insurance") {
          setActiveCategory("health-life");
        } else if (
          id === "two-wheeler-insurance" ||
          id === "four-wheeler-(car)-insurance" ||
          id.includes("vehicle") ||
          id.includes("wheeler")
        ) {
          setActiveCategory("vehicle");
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const policies: PolicyItem[] = [
    {
      id: "health-insurance",
      title: "Health Insurance",
      highlights: [
        "Cashless Billing: Zero cash upfront across network hospitals",
        "Full Cover: Rooms, ICU, doctor visits & medicines",
        "Annual Bonus: Cover increases each claim-free year",
        "Claim Support: Direct assistance during hospital admission",
      ],
      documents: [
        "Aadhaar & PAN: For insured family members",
        "Age Proof: Birth certificate or school card",
        "Medical Records: Only if you have ongoing health issues",
        "Old Policy: If switching or renewing existing plan",
      ],
      process: [
        "Quick Call: Share family size, health history & budget",
        "Compare: Review best plans from Star Health & Care",
        "Direct Pay: Official secure insurer payment portal",
        "Instant Cover: Policy card issued with 24/7 hospital help",
      ],
      costs: [
        { plan: "Individual Plan", cost: "Typically ₹5,000 – ₹18,000 / yr" },
        { plan: "Family Floater", cost: "Typically ₹14,000 – ₹38,000 / yr" },
      ],
      icon: Heart,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like help comparing health insurance plans for my family.`,
    },
    {
      id: "life-insurance",
      title: "Life Insurance",
      highlights: [
        "Family Security: Guaranteed financial payout for loved ones",
        "Govt Guarantee: 100% sovereign safety backed by LIC",
        "Goal Savings: Grow funds for child future or pension",
        "Tax-Free: Deposits & maturity payouts 100% tax exempt",
      ],
      documents: [
        "Aadhaar & PAN: Identity proof of applicant",
        "Income Proof: Salary slip, bank statement, or ITR",
        "Nominee Details: Nominee ID proof and bank details",
        "Medical: Arranged free of charge if required",
      ],
      process: [
        "Needs Check: Calculate right cover for family expenses",
        "Pick Plan: Pure family cover or guaranteed savings",
        "Simple Form: Quick proposal submission with official receipt",
        "Support: Lifetime help with nominees, updates & claims",
      ],
      costs: [
        { plan: "Family Cover (₹50L – ₹1 Cr)", cost: "From ₹600 – ₹1,800 / mo" },
        { plan: "Guaranteed Savings", cost: "Tailored to monthly savings goal" },
      ],
      icon: ShieldCheck,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like guidance on LIC term and savings plans.`,
    },
    {
      id: "two-wheeler-insurance",
      title: "Two-Wheeler Insurance",
      highlights: [
        "Instant Delivery: Official policy PDF on WhatsApp in minutes",
        "Accident & Theft: Covers road crashes, theft, fire & storms",
        "Zero Inspection: Instant renewal without bike check",
        "Keep Discount: Transfer your existing no-claim discount",
      ],
      documents: [
        "Bike RC: Photo of Registration Certificate",
        "Owner ID: Driving licence or Aadhaar card",
        "Old Policy: To transfer your existing discount",
      ],
      process: [
        "Send RC: Share photo of bike RC and old policy",
        "Compare: Instant quotes from HDFC, Tata & Bajaj",
        "Pay Direct: Secure link from the insurer",
        "Get Policy: Download renewed policy PDF instantly",
      ],
      costs: [
        { plan: "Third-Party Legal Cover", cost: "Approx. ₹1,200 – ₹2,800 / yr" },
        { plan: "Full Protection Package", cost: "Based on bike model and age" },
      ],
      icon: Bike,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like an instant quote for my two-wheeler insurance renewal.`,
    },
    {
      id: "four-wheeler-(car)-insurance",
      title: "Four-Wheeler (Car) Insurance",
      highlights: [
        "Cashless Repairs: Direct billing at authorized workshops",
        "Zero Dep: Full parts payout with no deduction",
        "24/7 Roadside: Free towing, flat tyre & battery jumps",
        "Monsoon Shield: Engine cover against waterlogging",
      ],
      documents: [
        "Car RC: Photo of Registration Certificate",
        "Owner ID: Driving licence or Aadhaar card",
        "Old Policy: To transfer your existing discount",
      ],
      process: [
        "Share RC: Send car details & old policy on WhatsApp",
        "Compare: Review quotes with Zero Dep & Roadside Help",
        "Pay Online: Direct payment with zero inspection",
        "Drive Safe: Instant policy with cashless garage support",
      ],
      costs: [
        { plan: "Hatchback & Sedan", cost: "Approx. ₹6,000 – ₹18,000 / yr" },
        { plan: "SUV & Luxury Cars", cost: "Based on vehicle market value" },
      ],
      icon: Car,
      whatsAppMsg: `Hi ${clientFirstName}, I need a quote and comparison for my car insurance renewal.`,
    },
  ];

  const filteredPolicies = policies.filter((policy) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'health-life') {
      return policy.id === "health-insurance" || policy.id === "life-insurance";
    }
    if (activeCategory === 'vehicle') {
      return policy.id === "two-wheeler-insurance" || policy.id === "four-wheeler-(car)-insurance";
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      {/* Header & Filter */}
      <div className="flex flex-col items-center">
        <SimplePageHeader 
          title="Insurance & Family Protection" 
          description="Health, life, and motor insurance with direct personal claim support." 
        />

        {/* Segmented Category Filter */}
        <div className="inline-flex p-1 bg-stone-100/90 rounded-full border border-stone-200/70 overflow-x-auto no-scrollbar gap-1 max-w-full justify-start sm:justify-center">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center",
              activeCategory === 'all'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            All Policies
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('health-life')}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center",
              activeCategory === 'health-life'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Health &amp; Life
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('vehicle')}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center",
              activeCategory === 'vehicle'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Motor Insurance
          </button>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="space-y-6 sm:space-y-8">
        {filteredPolicies.map((policy) => {
          const isExpanded = !!expandedCards[policy.id];
          const PolicyIcon = policy.icon;

          return (
            <AnimatedSection
              key={policy.id}
              animation="fade-up"
              delay={0}
              duration={350}
              className="scroll-mt-28"
              id={policy.id}
            >
              <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-7 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 text-left">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/60 flex-shrink-0">
                      <PolicyIcon className="w-5 h-5 text-emerald-800" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-tight">
                      {policy.title}
                    </h3>
                  </div>

                  {/* Desktop WhatsApp Action */}
                  <a
                    href={getWhatsAppUrl(policy.whatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-xs shadow-2xs hover:shadow-xs transition-all flex-shrink-0"
                    aria-label={`Get quote for ${policy.title} on WhatsApp`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Get Quote on WhatsApp</span>
                  </a>
                </div>

                {/* Symmetrical 2x2 Coverage Highlights */}
                <div className="mt-4 sm:mt-5">
                  <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                    {policy.highlights.map((highlight, idx) => {
                      const colonIdx = highlight.indexOf(":");
                      const hasColon = colonIdx !== -1;
                      const title = hasColon ? highlight.slice(0, colonIdx).trim() : "";
                      const desc = hasColon ? highlight.slice(colonIdx + 1).trim() : highlight;
                      return (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-stone-700 leading-snug font-normal">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          {hasColon ? (
                            <span>
                              <strong className="font-semibold text-stone-900">{title}:</strong>{" "}
                              <span className="text-stone-600">{desc}</span>
                            </span>
                          ) : (
                            <span>{highlight}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Requirements & Process Toggle */}
                <div className="mt-4 sm:mt-5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => toggleDetails(policy.id)}
                    className="w-full flex items-center justify-between text-xs font-medium text-stone-500 hover:text-stone-900 py-1 transition-colors group"
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-2 min-w-0 pr-2 text-left">
                      <FileText className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors flex-shrink-0" />
                      <span className="leading-snug">
                        {isExpanded ? "Hide details" : "View details"}
                      </span>
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 flex-shrink-0", isExpanded && "rotate-180")} />
                  </button>

                  {/* Clean Progressive Tabbed Drawer */}
                  {isExpanded && (
                    <div className="mt-3 pt-1 font-sans">
                      <Tabs defaultValue="process" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-stone-100/90 p-1 rounded-xl border border-stone-200/60 h-auto">
                          <TabsTrigger
                            value="process"
                            className="text-[11px] sm:text-xs py-1.5 px-1 sm:px-3 rounded-lg font-medium text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
                          >
                            How It Works
                          </TabsTrigger>
                          <TabsTrigger
                            value="documents"
                            className="text-[11px] sm:text-xs py-1.5 px-1 sm:px-3 rounded-lg font-medium text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
                          >
                            Documents
                          </TabsTrigger>
                          <TabsTrigger
                            value="premiums"
                            className="text-[11px] sm:text-xs py-1.5 px-1 sm:px-3 rounded-lg font-medium text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
                          >
                            Premiums
                          </TabsTrigger>
                        </TabsList>

                        {/* Process Tab */}
                        <TabsContent value="process" className="pt-3 focus-visible:outline-none">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {policy.process.map((step, idx) => {
                              const colonIdx = step.indexOf(":");
                              const hasColon = colonIdx !== -1;
                              const title = hasColon ? step.slice(0, colonIdx).trim() : "";
                              const desc = hasColon ? step.slice(colonIdx + 1).trim() : step;
                              return (
                                <div key={idx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50">
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <div className="text-xs">
                                    {hasColon ? (
                                      <>
                                        <span className="font-semibold text-stone-900 block">{title}</span>
                                        <span className="text-stone-600 mt-0.5 block leading-relaxed">{desc}</span>
                                      </>
                                    ) : (
                                      <span className="text-stone-700 leading-relaxed">{step}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>

                        {/* Documents Tab */}
                        <TabsContent value="documents" className="pt-3 focus-visible:outline-none">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {policy.documents.map((doc, idx) => {
                              const colonIdx = doc.indexOf(":");
                              const hasColon = colonIdx !== -1;
                              const title = hasColon ? doc.slice(0, colonIdx).trim() : "";
                              const desc = hasColon ? doc.slice(colonIdx + 1).trim() : doc;
                              return (
                                <div key={idx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50">
                                  <FileText className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs">
                                    {hasColon ? (
                                      <>
                                        <span className="font-semibold text-stone-900 block">{title}</span>
                                        <span className="text-stone-600 mt-0.5 block leading-relaxed">{desc}</span>
                                      </>
                                    ) : (
                                      <span className="text-stone-700 leading-relaxed">{doc}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>

                        {/* Estimated Premiums Tab */}
                        <TabsContent value="premiums" className="pt-3 focus-visible:outline-none">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {policy.costs.map((item, idx) => (
                              <div key={idx} className="p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50 flex flex-col justify-between">
                                <span className="text-[11px] font-medium text-stone-500">{item.plan}</span>
                                <span className="text-xs font-semibold text-stone-900 mt-0.5">{item.cost}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>

                {/* Mobile WhatsApp Action */}
                <div className="mt-4 sm:hidden">
                  <a
                    href={getWhatsAppUrl(policy.whatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-medium text-xs shadow-2xs transition-all"
                    aria-label={`Get quote for ${policy.title} on WhatsApp`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-100" />
                    <span>Get Quote on WhatsApp</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>



      {/* Cross-Navigation Next Step */}
      <div className="pt-2 sm:pt-4 text-center">
        <p className="text-xs sm:text-sm text-stone-500">
          Family protected? See how your savings can grow over time.
        </p>
        <Link 
          href="/invest" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 mt-1.5 transition-colors group"
        >
          <span>Explore Mutual Funds &amp; SIPs</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
