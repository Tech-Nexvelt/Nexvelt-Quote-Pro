import React from 'react';
import { QuotationContextColumn } from './QuotationContextColumn';
import { GuidedProductBuilder } from './GuidedProductBuilder';
import { RichProductCardsList } from './RichProductCardsList';
import { ChargesDiscountForm } from './ChargesDiscountForm';
import { StickyEstimatePanel } from './StickyEstimatePanel';

export const NexveltQuotationWorkspace: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN (30% -> lg:col-span-3.5) - Quotation Context */}
      <div className="lg:col-span-3 space-y-6">
        <QuotationContextColumn />
      </div>

      {/* CENTER COLUMN (45% -> lg:col-span-6) - Guided Builder & Rich Cards */}
      <div className="lg:col-span-6 space-y-6">
        {/* Guided Step-by-Step Product Builder with 300% Enlarged Visualizer */}
        <GuidedProductBuilder />

        {/* Rich Expandable Product Cards List */}
        <RichProductCardsList />

        {/* Additional Charges & GST Rules Form */}
        <ChargesDiscountForm />
      </div>

      {/* RIGHT COLUMN (25% -> lg:col-span-3) - Sticky Dominant Estimate Panel */}
      <div className="lg:col-span-3">
        <StickyEstimatePanel />
      </div>
    </div>
  );
};
