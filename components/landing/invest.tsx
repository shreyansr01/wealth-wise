'use client';

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Check,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  FileText,
} from "lucide-react";
import { SimplePageHeader } from "@/components/ui/simple-page-header";
import { AnimatedSection } from "@/components/ui/animated-section";
import InvestFaq from "@/components/landing/invest-faq";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

export default function InvestContent() {
  const { firstName: clientFirstName } = siteConfig;

  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const highlights = [
    { title: "Start Small", desc: "From ₹500/mo, scale or pause anytime" },
    { title: "Expert Choice", desc: "Top funds matched to your goals" },
    { title: "Monitored", desc: "Routine check-ins to stay on target" },
    { title: "Zero Lock-in", desc: "Direct bank withdrawals in 2–3 days" },
  ];

  const documents = [
    { title: "PAN Card", desc: "Standard tax ID for investor account" },
    { title: "Aadhaar Card", desc: "Mobile-linked for instant OTP" },
    { title: "Bank Details", desc: "Passbook or cheque copy for auto-SIP" },
    { title: "Nominee ID", desc: "Aadhaar or PAN of chosen nominee" },
  ];

  const processSteps = [
    { title: "Goal Call", desc: "Quick chat to map goals and timeline" },
    { title: "5-Min KYC", desc: "Paperless digital ID check on phone" },
    { title: "Start SIP", desc: "Fund selection & automated monthly save" },
    { title: "Check-ins", desc: "Ongoing review and performance tracking" },
  ];

  const pricingGuidelines = [
    { label: "Advisory Fee", value: "₹0 (100% Free)" },
    { label: "Fund Management", value: "Built into NAV (no extra bill)" },
    { label: "Long-Term Gains (> 1 yr)", value: "12.5% on profits over ₹1.25L/yr" },
    { label: "Short-Term Gains (< 1 yr)", value: "Flat 20% on profits" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      {/* Header */}
      <SimplePageHeader 
        title="Mutual Funds &amp; SIPs" 
        description="Goal-focused SIPs, curated mutual funds, and regular portfolio reviews." 
      />

      {/* Main Advisory Card */}
      <div id="mutual-funds" className="scroll-mt-28">
        <AnimatedSection animation="fade-up" delay={0} duration={350}>
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-7 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 text-left">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/60 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-tight">
                  Mutual Fund Portfolios
                </h3>
              </div>

              {/* Desktop Direct WhatsApp CTA */}
              <a
                href={getWhatsAppUrl(`Hi ${clientFirstName}, I'd like guidance on starting a disciplined SIP or reviewing my mutual fund portfolio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-xs shadow-2xs hover:shadow-xs transition-all flex-shrink-0"
                aria-label="Start SIP on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-100" />
                <span>Start SIP on WhatsApp</span>
              </a>
            </div>

            {/* Symmetrical 2x2 Highlights Grid */}
            <div className="mt-4 sm:mt-5">
              <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-stone-700 leading-snug font-normal">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-stone-900">{highlight.title}:</strong>{" "}
                      <span className="text-stone-600">{highlight.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Process Toggle */}
            <div className="mt-4 sm:mt-5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="w-full flex items-center justify-between text-xs font-medium text-stone-500 hover:text-stone-900 py-1 transition-colors group"
                aria-expanded={isDetailsExpanded}
              >
                <span className="flex items-center gap-2 min-w-0 pr-2 text-left">
                  <FileText className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors flex-shrink-0" />
                  <span className="leading-snug">
                    {isDetailsExpanded ? "Hide details" : "View details"}
                  </span>
                </span>
                <ChevronDown className={cn("w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 flex-shrink-0", isDetailsExpanded && "rotate-180")} />
              </button>

              {/* Clean Progressive Tabbed Drawer */}
              {isDetailsExpanded && (
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
                        value="fees"
                        className="text-[11px] sm:text-xs py-1.5 px-1 sm:px-3 rounded-lg font-medium text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
                      >
                        Fees &amp; Taxes
                      </TabsTrigger>
                    </TabsList>

                    {/* How It Works Tab */}
                    <TabsContent value="process" className="pt-3 focus-visible:outline-none">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {processSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="text-xs">
                              <span className="font-semibold text-stone-900 block">{step.title}</span>
                              <span className="text-stone-600 mt-0.5 block leading-relaxed">{step.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="pt-3 focus-visible:outline-none">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50">
                            <FileText className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-semibold text-stone-900 block">{doc.title}</span>
                              <span className="text-stone-600 mt-0.5 block leading-relaxed">{doc.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Fees & Taxes Tab */}
                    <TabsContent value="fees" className="pt-3 focus-visible:outline-none">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {pricingGuidelines.map((item, idx) => (
                          <div key={idx} className="p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-stone-200/50 flex flex-col justify-between">
                            <span className="text-[11px] font-medium text-stone-500">{item.label}</span>
                            <span className="text-xs font-semibold text-stone-900 mt-0.5">{item.value}</span>
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
                href={getWhatsAppUrl(`Hi ${clientFirstName}, I'd like guidance on starting a disciplined SIP or reviewing my mutual fund portfolio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-medium text-xs shadow-2xs transition-all"
                aria-label="Start SIP on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-100" />
                <span>Start SIP on WhatsApp</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* FAQ Section */}
      <div id="mutual-fund-faq" className="scroll-mt-28 pt-8 sm:pt-14">
        <InvestFaq />
      </div>

      {/* Cross-Navigation Next Step (Borderless & Airy) */}
      <div className="pt-2 sm:pt-4 text-center">
        <p className="text-xs sm:text-sm text-stone-500">
          Want to see how your money could grow over time?
        </p>
        <Link 
          href="/calculators" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 mt-1.5 transition-colors group"
        >
          <span>Calculate Potential Returns</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
