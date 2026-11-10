import { ArrowUpRight } from "lucide-react";

// Set to true if GitHub link is desired; kept false by default to protect client-facing credibility
const SHOW_GITHUB = false;

export default function ShowcaseFooter() {
  return (
    <footer className="w-full mt-auto border-t border-stone-200/70 bg-[#faf9f5]/50 backdrop-blur-xs py-[1.35rem] pb-24 md:pb-[1.35rem]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs sm:text-[13px]">
        {/* Left - Project Identity */}
        <div className="flex items-center gap-1.5 text-stone-500">
          <span className="font-semibold text-stone-800 tracking-tight">
            WealthWise
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300 shrink-0" aria-hidden="true" />
          <span className="text-stone-500 font-normal">
            Financial Advisory &amp; Services
          </span>
        </div>

        {/* Right - Attribution & Links */}
        <div className="flex items-center gap-1.5 text-stone-500">
          <span className="text-stone-400 font-normal">Built by</span>
          <a
            href="https://shreyansr.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 font-medium text-stone-600 hover:text-stone-900 transition-colors duration-200"
          >
            <span>Shreyan Sardar</span>
            <ArrowUpRight
              className="w-[13px] h-[13px] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
              aria-hidden="true"
            />
          </a>

          {SHOW_GITHUB && (
            <>
              <span className="text-stone-300 select-none" aria-hidden="true">
                /
              </span>
              <a
                href="https://github.com/shreyansr01/wealth-wise"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors duration-200"
              >
                <span>GitHub</span>
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[13px] h-[13px] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
