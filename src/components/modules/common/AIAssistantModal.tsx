import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: { title: string; category: string; rate: number; dimensions: string }) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplySuggestion,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const suggestions = [
    { title: '4-Door Sliding Wardrobe with PU Lacquer Finish', category: 'Wardrobes', rate: 1650, dimensions: '2400 × 2400 × 600 mm', desc: 'Recommended 18mm HDMR core with soft-close top-hung channels.' },
    { title: 'L-Shape Modular Kitchen (BWP Ply + Acrylic)', category: 'Kitchen', rate: 1750, dimensions: '3000 × 2400 × 600 mm', desc: 'Boiling Water Proof IS:710 Marine Ply base with anti-fingerprint acrylic doors.' },
    { title: 'Floating TV Unit with Louvered Charcoal Panelling', category: 'TV Units', rate: 1450, dimensions: '2100 × 1800 × 400 mm', desc: 'Fluted charcoal louvers with integrated LED strip channel slots.' },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A]">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6 text-[#00B8B8]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A]">Nexvelt AI Quotation Assistant</h3>
            <p className="text-xs text-[#64748B]">Smart material, hardware & pricing recommendations</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <label className="text-xs font-semibold text-[#0F172A] block">
            Describe what your client needs:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 3BHK Master Bedroom Wardrobe with mirror shutter..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="flex-1 h-10 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[#0F172A] focus:outline-none focus:border-[#00D9D9]"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="h-10 px-4 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            AI Recommended Configurations:
          </span>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#00D9D9] rounded-xl transition cursor-pointer group flex items-start justify-between gap-3"
                onClick={() => {
                  onApplySuggestion(s);
                  onClose();
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F172A] group-hover:text-[#00B8B8] transition">
                      {s.title}
                    </span>
                    <span className="text-[10px] font-mono bg-[#E0F7F7] text-[#008080] px-1.5 py-0.5 rounded">
                      ₹{s.rate}/sq.ft
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{s.desc}</p>
                </div>
                <button className="text-[#00B8B8] opacity-0 group-hover:opacity-100 transition pt-1">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
