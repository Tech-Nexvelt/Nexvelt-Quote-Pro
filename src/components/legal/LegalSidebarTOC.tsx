import React, { useState, useEffect } from 'react';
import { List, Printer, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TOCSection {
  id: string;
  title: string;
}

interface LegalSidebarTOCProps {
  sections: TOCSection[];
  lastUpdated?: string;
}

export const LegalSidebarTOC: React.FC<LegalSidebarTOCProps> = ({ sections, lastUpdated = 'July 29, 2026' }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Sticky Table of Contents Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs sticky top-24 space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            <List className="w-4 h-4 text-[#00B8B8]" />
            <span>Table of Contents</span>
          </div>
          <button
            onClick={handlePrint}
            title="Print document"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>

        {/* Sections List */}
        <nav className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
          {sections.map((sec, idx) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#E6F7F7] text-[#008080] font-extrabold border border-[#00D9D9]/30 translate-x-0.5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{sec.title}</span>
                <span className="text-[10px] font-mono opacity-60 ml-2">0{idx + 1}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Legal Support Box */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[#008080] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#00B8B8]" />
              <span>Questions?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Have questions regarding this policy or data protection? Contact our legal team.
            </p>
            <Link
              to="/legal/contact"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00B8B8] hover:underline"
            >
              <span>Contact Legal Team</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold text-center">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>
    </aside>
  );
};
