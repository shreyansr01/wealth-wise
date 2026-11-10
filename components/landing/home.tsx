'use client';

import Link from "next/link";
import {
  Heart,
  ClipboardList,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { Button } from "@/components/ui/button";
import Advisor from "@/components/landing/advisor";
import Partners from "@/components/landing/partners";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

export default function HomeContent() {
  const { name: clientName, firstName: clientFirstName } = siteConfig;

  const scrollToServices = () => {
    const el = document.getElementById('core-services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const coreServices = [
    {
      title: "Mutual Funds",
      description: "Goal-based SIPs and portfolios for steady long-term growth.",
      icon: TrendingUp,
      href: "/invest#mutual-funds",
    },
    {
      title: "Health Insurance",
      description: "Cashless hospital coverage for individuals and families.",
      icon: Heart,
      href: "/insurance#health-insurance",
    },
    {
      title: "Life Insurance",
      description: "Term insurance and guaranteed pension plans via LIC.",
      icon: ShieldCheck,
      href: "/insurance#life-insurance",
    },
    {
      title: "Income Tax Filing (ITR)",
      description: "Expert tax filing, deduction checks, and fast refunds.",
      icon: ClipboardList,
      href: "/documents#income-tax-filing",
    },
    {
      title: "Document Services",
      description: "PAN, Aadhaar, driving licences, and trade permits.",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Financial Calculators",
      description: "Quick projections for SIPs, education, and retirement.",
      icon: Calculator,
      href: "/calculators",
    },
  ];

  const proofMetrics = [
    { value: "750+", label: "Families Guided" },
    { value: "19+", label: "Years of Experience" },
    { value: "₹30L+", label: "Assets Managed" },
    { value: "20+", label: "Financial Services" },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section - Open & Breathable */}
      <AnimatedSection
        animation="fade-up"
        delay={0}
        duration={400}
        className="max-w-4xl mx-auto pt-4 sm:pt-10 text-center flex flex-col items-center px-4"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold font-serif text-stone-900 tracking-tight leading-[1.15] text-balance">
          Financial Planning Made Simple
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-3 sm:mt-4 leading-normal text-pretty">
          Clear guidance from <span className="font-semibold text-stone-900">{clientName}</span> to protect your family and build long-term wealth.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-5 sm:mt-7 w-full max-w-xs sm:max-w-none mx-auto">
          <a
            href={getWhatsAppUrl(`Hi ${clientFirstName}, I'd like to schedule a free consultation to discuss my financial goals.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-block"
            aria-label="Contact on WhatsApp"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-52 h-11 px-6 rounded-full font-medium tracking-wide transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Free Consultation</span>
            </Button>
          </a>

          <Button 
            onClick={scrollToServices}
            size="lg" 
            className="group w-full sm:w-52 h-11 px-6 bg-white hover:bg-stone-50 text-stone-800 hover:text-stone-900 rounded-full font-medium tracking-wide transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-stone-200/90 hover:border-stone-300"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-stone-800 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Clean Proof Metrics Bar (No Nested Boxiness) */}
        <div className="w-full max-w-3xl mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-stone-200/60">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8">
            {proofMetrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <span className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 tracking-tight">
                  {metric.value}
                </span>
                <span className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Core Services Section */}
      <AnimatedSection id="core-services-section" className="text-center scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Our Core Services
          </h2>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {coreServices.map((service, index) => (
            <Link href={service.href} key={index} className="h-full block">
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/70 bg-white/70 hover:bg-white hover:border-stone-300/90 hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.99] active:bg-stone-50/90 transition-all duration-200 flex items-start justify-between gap-3 text-left h-full group">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 text-stone-600 group-hover:text-emerald-700 transition-colors duration-200 flex-shrink-0">
                    <service.icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-[15px] sm:text-base text-stone-900 group-hover:text-emerald-950 transition-colors tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-snug">
                      {service.description}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 opacity-40 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* Advisor Profile Section */}
      <AnimatedSection>
        <Advisor />
      </AnimatedSection>

      {/* Client Testimonials */}
      <AnimatedSection className="text-center max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Trusted by Working Families &amp; Professionals
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          <TestimonialCard
            name="Apurbo Saha"
            role="CEO, GS Diesel Company"
            testimonial={`${clientFirstName} sorted out our family's health insurance and mutual funds without any confusion. Clear advice and always responsive.`}
          />
          <TestimonialCard
            name="Sanchita Mondal"
            role="Cashier, State Bank of India"
            testimonial={`He explains investments in simple words so you always know where your money goes. Whenever I have a question, he is just a phone call away.`}
          />
          <TestimonialCard
            name="Dr. Debashis Sarkar"
            role="Physician"
            testimonial={`With long hospital shifts, I rarely have time for paperwork. ${clientFirstName} took care of our term and health insurance quickly and smoothly.`}
          />
        </div>
      </AnimatedSection>

      {/* Trusted Partners */}
      <AnimatedSection>
        <Partners />
      </AnimatedSection>

    </div>
  );
}
