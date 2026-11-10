'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Check,
  MessageCircle,
  ChevronDown,
  FileText,
  ArrowRight,
  FileCheck,
  UserCheck,
  BookUser,
  HeartHandshake,
  Car,
  Calculator,
  Briefcase,
  ScrollText,
  Coins,
} from "lucide-react";
import { SimplePageHeader } from "@/components/ui/simple-page-header";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

interface CostItem {
  label: string;
  value: string;
}

interface DocumentService {
  id: string;
  category: 'personal' | 'vehicle' | 'business';
  title: string;
  highlights: string[];
  documents: string[];
  process: string[];
  costs: CostItem[];
  icon: React.ElementType;
  whatsAppMsg: string;
}

export default function DocumentsContent() {
  const { firstName: clientFirstName } = siteConfig;

  const [activeCategory, setActiveCategory] = useState<'all' | 'personal' | 'vehicle' | 'business'>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    category: 'all' | 'personal' | 'vehicle' | 'business',
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
          // to the left so hidden options come into view. Earlier filters slide back to the start.
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
        if (
          id.includes("pan") ||
          id.includes("aadhaar") ||
          id.includes("voter") ||
          id.includes("ration") ||
          id.includes("birth") ||
          id.includes("passport") ||
          id.includes("marriage")
        ) {
          handleCategorySelect("personal", 1);
        } else if (
          id.includes("driving") ||
          id.includes("licence") ||
          id.includes("vehicle") ||
          id.includes("ownership") ||
          id.includes("rto")
        ) {
          handleCategorySelect("vehicle", 2);
        } else if (
          id.includes("tax") ||
          id.includes("trade") ||
          id.includes("agreement") ||
          id.includes("affidavit") ||
          id.includes("business") ||
          id.includes("p.tax")
        ) {
          handleCategorySelect("business", 3);
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

  const allDocumentServices: DocumentService[] = [
    // --- PERSONAL IDS & REGISTRY ---
    {
      id: "pan-card-services",
      category: "personal",
      title: "PAN Card Services",
      highlights: [
        "Essential ID: Mandatory for bank accounts, salary & investments",
        "Digital e-PAN: Official PDF sent to your email in 24–48 hrs",
        "Home Delivery: Plastic card mailed to your doorstep by India Post",
        "Aadhaar Link: Fast help to reactivate locked or inactive cards",
      ],
      documents: [
        "Aadhaar Card: Mobile-linked for instant OTP verification",
        "Address Proof: Electricity bill, passbook, or voter card",
        "Photographs: 2 passport-size colour photos",
        "Old PAN / FIR: Only if repairing details or lost card",
      ],
      process: [
        "Send Details: Share photo and Aadhaar on WhatsApp",
        "Official Filing: Submitted on government NSDL portal",
        "Digital e-PAN: Valid digital card emailed within 24–48 hours",
        "Card by Post: Physical plastic card mailed to your home",
      ],
      costs: [
        { label: "New PAN Application", value: "₹250" },
        { label: "Correction / Duplicate", value: "₹250" },
        { label: "Aadhaar-PAN Linking", value: "₹1,150 (incl. ₹1,000 govt fee)" },
        { label: "Physical Card Delivery", value: "Included" },
      ],
      icon: FileText,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like help with PAN card application or corrections. Could you please guide me?`,
    },
    {
      id: "aadhaar-card-services",
      category: "personal",
      title: "Aadhaar Card Services",
      highlights: [
        "Universal ID: Accepted across all banks, SIMs & govt schemes",
        "Online Updates: Update address or name without queues",
        "Official PVC Card: Waterproof pocket smart card with secure QR code",
        "Fast e-Aadhaar: Quick download and colour lamination assistance",
      ],
      documents: [
        "Aadhaar Number: Active mobile number for OTP access",
        "Address Proof: Electricity bill, passbook, or rent agreement",
        "ID Proof: Voter ID, passport, or PAN (for name/DOB change)",
        "Name Change Proof: Marriage certificate or gazette notice",
      ],
      process: [
        "Send Request: Share Aadhaar number and required change",
        "Portal Update: Submitted securely on official UIDAI portal",
        "Track Request: Monitor official URN tracking number",
        "Download & Post: Download e-Aadhaar; PVC card mailed to home",
      ],
      costs: [
        { label: "Online Address Update", value: "₹250" },
        { label: "Demographic Correction", value: "₹250" },
        { label: "Official UIDAI PVC Card", value: "₹100" },
        { label: "e-Aadhaar Download & Print", value: "₹50" },
      ],
      icon: UserCheck,
      whatsAppMsg: `Hi ${clientFirstName}, I need assistance with Aadhaar updates or ordering a PVC card. Could you please guide me?`,
    },
    {
      id: "voter-id-card-services",
      category: "personal",
      title: "Voter ID Card Services",
      highlights: [
        "Constitutional ID: Official proof of citizenship and voting rights",
        "Address Transfer: Smooth shift to your new address in WB",
        "Digital e-EPIC: Official digital voter card saved directly to phone",
        "Easy Corrections: Fix spelling mistakes in name, age, or relation",
      ],
      documents: [
        "Aadhaar Card: Photo identity and current address proof",
        "Age Proof: Birth certificate, school admit card, or PAN",
        "Address Proof: Electricity bill or family member voter card",
        "Photograph: 1 passport-size color photograph",
      ],
      process: [
        "Fill Online Form: Select Form 6 (new voter) or Form 8 (shift/edit)",
        "Upload Proofs: Attach verified age and residence documents",
        "Officer Check: Verified by local Booth Level Officer (BLO)",
        "Card Issued: Download digital e-EPIC; plastic card mailed",
      ],
      costs: [
        { label: "New Voter ID (Form 6)", value: "₹200" },
        { label: "Address Transfer (Form 8)", value: "₹200" },
        { label: "Name / Detail Correction", value: "₹200" },
        { label: "Mobile Link & e-EPIC", value: "₹50" },
      ],
      icon: FileCheck,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like help with Voter ID card application or transfer. Could you please guide me?`,
    },
    {
      id: "ration-card-services",
      category: "personal",
      title: "Ration Card Services",
      highlights: [
        "Family Proof: Government-recognized proof for address & subsidised grains",
        "Digital e-Ration: WB Khadya Sathi digital card saved to phone",
        "Add Family: Quickly add newborn babies or newly married spouse",
        "Aadhaar e-KYC: Instant Aadhaar linking to prevent card suspension",
      ],
      documents: [
        "Aadhaar Cards: Copies for all family members",
        "Family Head ID: Photo and mobile number of card head",
        "Relationship Proof: Birth certificate for child or marriage deed",
        "Old Ration Card: Required for transfers or corrections",
      ],
      process: [
        "Collect IDs: Compile family Aadhaar cards on WhatsApp",
        "Portal Filing: Submit on WB Food & Supplies portal",
        "Inspector Review: Fast approval by municipal/block inspector",
        "Get e-Card: Download digital ration card mapped to dealer",
      ],
      costs: [
        { label: "New Family Application", value: "₹300 / person" },
        { label: "Add Family Member", value: "₹200" },
        { label: "Ration Shop Transfer", value: "₹200" },
        { label: "Aadhaar e-KYC Linking", value: "₹50" },
      ],
      icon: FileText,
      whatsAppMsg: `Hi ${clientFirstName}, I need help with Ration card services and family member updates. Could you please assist?`,
    },
    {
      id: "passport-services",
      category: "personal",
      title: "Passport Services",
      highlights: [
        "Guaranteed Slot: Confirmed appointment at PSK Kolkata or Post Office",
        "Document Vetting: Pre-screening to prevent counter rejections",
        "Normal & Tatkaal: Standard and urgent bookings for fast travel",
        "Fast Renewal: Simple process for expired or damaged passports",
      ],
      documents: [
        "Aadhaar Card: Linked with DigiLocker for instant verification",
        "PAN or Voter ID: Secondary government photo identity",
        "Education Proof: Class 10 admit card or degree (for Non-ECR)",
        "Old Passport: Original booklet (for renewals)",
      ],
      process: [
        "Profile Filing: Error-free application on Passport Seva",
        "Book Slot: Pay govt fees and secure preferred PSK date",
        "Document Prep: Checklist of exact originals to carry",
        "Police & Dispatch: Tracking until passport arrives home",
      ],
      costs: [
        { label: "Fresh Passport (36 Pages)", value: "₹2,100 (incl. ₹1,500 govt fee)" },
        { label: "Fresh Passport (60 Pages)", value: "₹2,650 (incl. ₹2,000 govt fee)" },
        { label: "Passport Renewal", value: "₹2,200 (incl. govt fee)" },
        { label: "Tatkaal Booking", value: "Customized quote" },
      ],
      icon: BookUser,
      whatsAppMsg: `Hi ${clientFirstName}, I need help with Passport application and appointment booking at PSK. Could you please guide me?`,
    },
    {
      id: "marriage-registration",
      category: "personal",
      title: "Marriage Registration",
      highlights: [
        "Legal Proof: Essential for spouse visas, joint loans & banking",
        "Govt-Authorized: Registered under Special or Hindu Marriage Act",
        "Advocate Drafting: Complete legal paperwork and witness affidavits",
        "Flexible Slot: Signing at registrar office or your venue",
      ],
      documents: [
        "Couple IDs: Aadhaar, Voter ID, or Passport of bride & groom",
        "Age Proof: Class 10 admit card or birth certificate",
        "Wedding Photos: 4 passport photos each + wedding card",
        "3 Witnesses: Aadhaar cards and photos of 3 adult witnesses",
      ],
      process: [
        "Notice Filing: Submit official notice to marriage registrar",
        "Paperwork Prep: Draft affidavits for bride, groom & 3 witnesses",
        "Registrar Signing: Quick formal appearance to sign register",
        "Official Certificate: Collect government-stamped certificate",
      ],
      costs: [
        { label: "Hindu Marriage Registration", value: "From ₹3,000" },
        { label: "Special Marriage (30-Day)", value: "From ₹4,500" },
        { label: "Certified Urgent Copy", value: "Customized quote" },
        { label: "Legal Drafting", value: "Included" },
      ],
      icon: HeartHandshake,
      whatsAppMsg: `Hi ${clientFirstName}, I would like information regarding legal marriage registration services. Could you please guide me?`,
    },

    // --- DRIVING & VEHICLE ---
    {
      id: "new-driving-licence",
      category: "vehicle",
      title: "New Driving Licence",
      highlights: [
        "Legal Permit: Drive bikes (MCWG) and cars (LMV) across India",
        "Computer Test Prep: Simple sample test questions to pass easily",
        "RTO Track Slot: Hassle-free booking for your practical driving test",
        "Smart Card Delivery: Official chip licence mailed to your home",
      ],
      documents: [
        "Aadhaar Card: Paperless KYC for online learner licence",
        "Age Proof: Class 10 admit card, birth certificate, or PAN",
        "Blood Group: Blood test report or self-declaration",
        "Photographs: 2 passport-size color photographs",
      ],
      process: [
        "Learner Licence: Apply online & pass simple 10-min test",
        "30-Day Practice: Mandatory practice period with learner slip",
        "RTO Track Test: Book slot and pass practical driving test",
        "Smart Card Post: Official driving licence delivered by speed post",
      ],
      costs: [
        { label: "Two-Wheeler (MCWG)", value: "₹2,500 (all-inclusive)" },
        { label: "Four-Wheeler (LMV)", value: "₹3,000 (all-inclusive)" },
        { label: "Combined 2W + 4W", value: "₹4,800 (all-inclusive)" },
        { label: "RTO Slot & Govt Fees", value: "Included" },
      ],
      icon: Car,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like to apply for a Driving Licence. Could you please guide me through the RTO process?`,
    },
    {
      id: "licence-renewal-&-corrections",
      category: "vehicle",
      title: "Licence Renewal & Corrections",
      highlights: [
        "Avoid Fines: Keep insurance valid and avoid heavy traffic penalties",
        "Lost DL Reissue: Fast duplicate licence with police diary and affidavit",
        "Smart Card Upgrade: Upgrade old paper licences to chip cards",
        "Fix Details: Correct spelling, change address, or update blood group",
      ],
      documents: [
        "Current Licence: Original card (or police diary if lost)",
        "Aadhaar Card: Updated with current residential address",
        "Medical Form 1-A: Doctor fitness certificate (if age > 40)",
        "Photographs: 2 passport-size color photographs",
      ],
      process: [
        "Send DL Photo: Share licence photo and updates on WhatsApp",
        "Sarathi Filing: Submit renewal or correction on Parivahan",
        "Medical Certificate: Fast help with Form 1-A fitness check",
        "Post Delivery: Renewed smart card dispatched to your address",
      ],
      costs: [
        { label: "DL Renewal (within 1 yr)", value: "₹1,800 (+ govt late fee if > 1 yr)" },
        { label: "Lost Licence / Duplicate", value: "₹2,550 (incl. police diary & affidavit)" },
        { label: "Address or Name Change", value: "₹1,800" },
        { label: "Paper to Smart Card", value: "₹2,000" },
      ],
      icon: Car,
      whatsAppMsg: `Hi ${clientFirstName}, I need assistance with driving licence renewal/correction. Could you please help?`,
    },
    {
      id: "vehicle-ownership-transfer",
      category: "vehicle",
      title: "Vehicle Ownership Transfer",
      highlights: [
        "Protects Seller: Clears all accident and legal liability after sale",
        "Protects Buyer: Guarantees clean vehicle title and valid insurance",
        "Loan Removal (HPA): Clear bank hypothecation lien after final EMI",
        "All WB RTOs: Full support at Beltala, Kasba, Salt Lake & Barasat",
      ],
      documents: [
        "Original RC: Physical registration smart card",
        "Insurance & PUC: Valid motor insurance and pollution slip",
        "Signed RTO Forms: Form 29 and 30 signed by buyer and seller",
        "Bank NOC: Form 35 from loan company (if vehicle had loan)",
      ],
      process: [
        "Title & Fine Check: Verify clear title and clear pending challans",
        "RTO Paperwork: Prepare Form 29, 30 & sale affidavits",
        "RTO Submission: Submit file for physical inspection & entry",
        "New RC Smart Card: New smart card issued to buyer",
      ],
      costs: [
        { label: "Two-Wheeler Transfer", value: "Approx. ₹4,500" },
        { label: "Four-Wheeler Transfer", value: "Varies by vehicle age & RTO" },
        { label: "Bank Loan Removal (HPT)", value: "₹1,800 + govt fees" },
        { label: "Inter-RTO / State NOC", value: "Customized quote" },
      ],
      icon: Car,
      whatsAppMsg: `Hi ${clientFirstName}, I need help with vehicle ownership transfer (RC transfer). Could you please explain the process?`,
    },

    // --- BUSINESS & TAX ---
    {
      id: "income-tax-filing",
      category: "business",
      title: "Income Tax Filing (ITR)",
      highlights: [
        "Crucial Proof: Mandatory for home loans, credit cards & foreign visas",
        "Notice-Free: Cross-checked with tax portal (AIS/TIS) to avoid audits",
        "Maximum Refund: Claim all eligible deductions under Section 80C & 80D",
        "Expert-Assisted: Prepared accurately by tax experts with zero guesswork",
      ],
      documents: [
        "Aadhaar & PAN: Linked identity proofs",
        "Form 16: Salary certificate from employer (if salaried)",
        "Bank Statements: Passbook or PDF for the financial year",
        "Capital Gains: Mutual fund or share profit statements",
      ],
      process: [
        "Send Details: Share Form 16 and statements on WhatsApp",
        "Draft Computation: Tax expert calculates maximum eligible refund",
        "Review & Confirm: Approve the return summary before submission",
        "Instant ITR-V: Official acknowledgement filed and emailed",
      ],
      costs: [
        { label: "Salaried Individual (ITR-1)", value: "From ₹699" },
        { label: "Capital Gains / Multiple (ITR-2)", value: "From ₹999" },
        { label: "Small Business / Presumptive (ITR-3/4)", value: "From ₹1,699" },
        { label: "TDS Refund & Notice Help", value: "Customized quote" },
      ],
      icon: Calculator,
      whatsAppMsg: `Hi ${clientFirstName}, I'd like help filing my Income Tax Return. Could you please share the checklist and fees?`,
    },
    {
      id: "trade-license-services",
      category: "business",
      title: "Trade License Services",
      highlights: [
        "Mandatory Permit: Required to run any shop, firm, or business legally",
        "Bank Current Account: Essential document to open a business account",
        "Avoid Penalties: Timely annual renewals prevent municipal fines",
        "Broad Coverage: Filed across KMC, municipalities & panchayats",
      ],
      documents: [
        "Proprietor IDs: Aadhaar and PAN of owner or directors",
        "Premises Proof: Property tax bill or rent agreement with NOC",
        "Electricity Bill: Commercial meter bill for premises",
        "Firm Registration: Partnership deed or company MOA (if any)",
      ],
      process: [
        "Share Details: Send business name & premises tax receipt",
        "Municipal Filing: Application submitted on municipal / KMC portal",
        "Pay Govt Fees: Official statutory municipal fee payment",
        "Download License: Instant Certificate of Enlistment (CE) issued",
      ],
      costs: [
        { label: "Panchayat / Municipality", value: "From ₹500 + govt fees" },
        { label: "KMC Corporation License", value: "From ₹1,000 + govt fees" },
        { label: "Annual License Renewal", value: "From ₹400 + govt fees" },
        { label: "Category / Name Amendment", value: "₹800 + govt fees" },
      ],
      icon: Briefcase,
      whatsAppMsg: `Hi ${clientFirstName}, I need help obtaining or renewing a Trade License for my business. Could you please guide me?`,
    },
    {
      id: "agreements-&-affidavits",
      category: "business",
      title: "Agreements & Affidavits",
      highlights: [
        "Advocate-Drafted: Legally airtight clauses drafted by lawyers",
        "Prevents Disputes: Protects landlords, tenants & business partners",
        "Notarized Stamp Paper: Printed on government stamp paper with official seal",
        "Same-Day Delivery: Fast drafting with doorstep delivery in Kolkata",
      ],
      documents: [
        "Party IDs: Aadhaar and PAN of all signing parties",
        "Property Details: Holding number, address, or tax bill",
        "Agreed Terms: Monthly rent, security deposit & notice rules",
        "Photographs: 2 passport-size photos of each party",
      ],
      process: [
        "Send Terms: Share rent, deposit, and names on WhatsApp",
        "Drafting: Legal advocate prepares balanced agreement",
        "Review: Review draft on WhatsApp before stamp printing",
        "Notary Seal: Executed on stamp paper with authorized Notary seal",
      ],
      costs: [
        { label: "Sworn Notarized Affidavit", value: "From ₹350 (incl. stamp & notary)" },
        { label: "Residential Rent Agreement", value: "From ₹1,200 (incl. stamp paper)" },
        { label: "Commercial Lease Deed", value: "From ₹2,500 (custom terms)" },
        { label: "Partnership Deed", value: "From ₹3,500" },
      ],
      icon: ScrollText,
      whatsAppMsg: `Hi ${clientFirstName}, I need help drafting an agreement or notarized affidavit. Could you please share the details?`,
    },
    {
      id: "professional-tax-(p.tax)",
      category: "business",
      title: "Professional Tax (P.Tax)",
      highlights: [
        "Legal Requirement: Mandatory for businesses & self-employed professionals",
        "Trade License Renewal: Enrolment Certificate (EC) needed for trade renewals",
        "Staff Deductions: Registration Certificate (RC) to deduct employee tax",
        "Notice Shield: Stay compliant and prevent late interest & fines",
      ],
      documents: [
        "Business IDs: Trade License and business PAN card",
        "Bank Details: Business bank statement or cancelled cheque",
        "Owner KYC: Aadhaar and PAN of proprietor or partners",
        "Payroll Summary: Staff count or annual turnover statement",
      ],
      process: [
        "Check Slab: Identify exact West Bengal P.Tax liability",
        "Online Filing: Register on WB Commercial Taxes portal",
        "Challan Payment: Pay statutory tax online with official receipt",
        "Get Certificate: Download official Enrolment (EC) or Registration (RC)",
      ],
      costs: [
        { label: "WB Monthly P.Tax Liability", value: "₹110 – ₹200 (statutory slab)" },
        { label: "New Enrolment (EC)", value: "₹500 (one-time filing)" },
        { label: "Employer Registration (RC)", value: "₹1,000 (setup & filing)" },
        { label: "Annual P.Tax Return Filing", value: "₹500 per submission" },
      ],
      icon: Coins,
      whatsAppMsg: `Hi ${clientFirstName}, I need help with Professional Tax (P.Tax) registration or annual return filing. Could you please assist?`,
    },
  ];

  const filteredServices = allDocumentServices.filter((service) => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      {/* Header & Segmented Category Filter */}
      <div className="flex flex-col items-center">
        <SimplePageHeader 
          title="Document &amp; Legal Services" 
          description="Assistance with government IDs, vehicle paperwork, trade permits, and tax filing." 
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
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center shrink-0",
              activeCategory === 'all'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            All Services
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('personal', 1)}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center shrink-0",
              activeCategory === 'personal'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Personal IDs
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('vehicle', 2)}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center shrink-0",
              activeCategory === 'vehicle'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Driving &amp; Vehicle
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('business', 3)}
            className={cn(
              "px-3 sm:px-3.5 py-1.5 text-xs rounded-full font-medium transition-all whitespace-nowrap text-center shrink-0",
              activeCategory === 'business'
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Business &amp; Tax
          </button>
        </div>
      </div>

      {/* Service Cards */}
      <div className="space-y-6 sm:space-y-8">
        {filteredServices.map((service) => {
          const isExpanded = !!expandedCards[service.id];
          const ServiceIcon = service.icon;
          const isITR = service.id === "income-tax-filing";

          return (
            <AnimatedSection
              key={service.id}
              animation="fade-up"
              delay={0}
              duration={350}
              className="scroll-mt-28 relative"
              id={service.id}
            >
              {isITR && (
                <>
                  <span id="income-tax-filing-(itr)" className="absolute -top-28 pointer-events-none" />
                  <span id="income-tax-filing-services" className="absolute -top-28 pointer-events-none" />
                </>
              )}
              <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-7 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 text-left">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/60 flex-shrink-0">
                      <ServiceIcon className="w-5 h-5 text-emerald-800" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-tight">
                      {service.title}
                    </h3>
                  </div>

                  {/* Desktop Direct WhatsApp CTA */}
                  <a
                    href={getWhatsAppUrl(service.whatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-xs shadow-2xs hover:shadow-xs transition-all flex-shrink-0"
                    aria-label={`Inquire about ${service.title} on WhatsApp`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Symmetrical 2x2 Highlights Grid */}
                <div className="mt-4 sm:mt-5">
                  <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                    {service.highlights.map((highlight, idx) => {
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

                {/* Requirements & Process Drawer Toggle */}
                <div className="mt-4 sm:mt-5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => toggleDetails(service.id)}
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
                            value="fees"
                            className="text-[11px] sm:text-xs py-1.5 px-1 sm:px-3 rounded-lg font-medium text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
                          >
                            Fees
                          </TabsTrigger>
                        </TabsList>

                        {/* Process Tab */}
                        <TabsContent value="process" className="pt-3 focus-visible:outline-none">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {service.process.map((step, idx) => {
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
                            {service.documents.map((doc, idx) => {
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

                        {/* Official Fees Tab */}
                        <TabsContent value="fees" className="pt-3 focus-visible:outline-none">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {service.costs.map((item, idx) => (
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
                    href={getWhatsAppUrl(service.whatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-full font-medium text-xs shadow-2xs transition-all"
                    aria-label={`Inquire about ${service.title} on WhatsApp`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-100" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>



      {/* Cross-Navigation Next Step (Borderless & Airy) */}
      <div className="pt-2 sm:pt-4 text-center">
        <p className="text-xs sm:text-sm text-stone-500">
          Need coverage for your health, life, or vehicle?
        </p>
        <Link 
          href="/insurance" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 mt-1.5 transition-colors group"
        >
          <span>Explore Insurance Plans</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
