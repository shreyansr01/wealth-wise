'use client';

import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { siteConfig, getWhatsAppUrl } from "@/lib/site-config";

interface AdvisorInfo {
  name: string;
  profession: string;
  phone: string;
  email: string;
  address: string;
}

export function AdvisorSection({ advisor }: { advisor: AdvisorInfo }) {
  const whatsAppUrl = getWhatsAppUrl(undefined, advisor.phone);

  return (
    <section className="max-w-[740px] mx-auto px-4 sm:px-6">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6">
          {/* Left - Portrait */}
          <div className="relative w-28 sm:w-32 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-2xs mx-auto md:mx-0">
            <Image
              src="/advisor-sketch.png"
              alt={advisor.name}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 112px, 128px"
            />
          </div>

          {/* Right - Profile & Direct Channels */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <div>
              {/* Unboxed Regulatory Eyebrow */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-0.5 text-[11.5px] sm:text-xs mb-1.5 font-medium text-emerald-800">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>NISM &amp; IRDA Certified</span>
                </div>
                <span className="text-stone-300" aria-hidden="true">•</span>
                <span className="font-semibold">
                  ARN: 155875
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
                {advisor.name}
              </h2>
              <p className="text-xs sm:text-[13px] text-stone-600 mt-1 leading-snug text-pretty">
                Straightforward financial planning and insurance guidance for families.
              </p>
            </div>

            {/* Symmetrical Contact Channels (Clean, quiet, single-line on desktop, full-width on mobile) */}
            <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center justify-center md:justify-start gap-1.5 sm:gap-2 mt-3.5 sm:mt-4 w-full">
              <a 
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-stone-50/80 hover:bg-emerald-50/90 hover:border-emerald-300 hover:shadow-xs active:bg-emerald-100/70 active:scale-[0.99] text-stone-700 hover:text-emerald-950 border border-stone-200/60 transition-all duration-200 text-[11px] sm:text-xs font-medium w-full sm:w-auto shrink-0 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-700 transition-colors shrink-0" />
                <span>{advisor.phone}</span>
              </a>

              <a 
                href={`mailto:${advisor.email}`}
                className="group inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-stone-50/80 hover:bg-emerald-50/90 hover:border-emerald-300 hover:shadow-xs active:bg-emerald-100/70 active:scale-[0.99] text-stone-700 hover:text-emerald-950 border border-stone-200/60 transition-all duration-200 text-[11px] sm:text-xs font-medium w-full sm:w-auto shrink-0 whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-700 transition-colors shrink-0" />
                <span>{advisor.email}</span>
              </a>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(advisor.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-stone-50/80 hover:bg-emerald-50/90 hover:border-emerald-300 hover:shadow-xs active:bg-emerald-100/70 active:scale-[0.99] text-stone-700 hover:text-emerald-950 border border-stone-200/60 transition-all duration-200 text-[11px] sm:text-xs font-medium w-full sm:w-auto shrink-0 whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-700 transition-colors shrink-0" />
                <span>Budge Budge, Kolkata</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Advisor() {
  const advisorData: AdvisorInfo = {
    name: siteConfig.name,
    profession: "NISM & IRDA Certified",
    phone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
  };

  return <AdvisorSection advisor={advisorData} />;
}