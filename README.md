# Nexvelt Quote Pro

> **Professional Interior & Furniture Quotation Software**  
> Built for VLR Interior Solutions — Siddipet, Telangana

---

## 🚀 Overview

**Nexvelt Quote Pro** is a full-featured, enterprise-grade quotation builder application designed specifically for interior design and modular furniture businesses. Create professional A4-formatted quotations with branding, detailed item configurations, live pricing calculations, and PDF exports — all from a single browser-based interface.

---

## ✨ Features

- **Multi-Step Quote Builder** — Customer details, Scope of Work selection, item configuration, and summary in a clean step-by-step flow
- **Live Cost Engine** — Real-time pricing updates as you add items, measurements, and rates
- **Scope of Work Selection** — Box Work, Frame Work, Shutters, Wall Panelling, Countertops, and Other Items (Hardware / Accessories / Labour)
- **Product Item Cards** — Custom product name, item details, dimensions (mm / ft / inch), area calculation, material & finish selection
- **A4 Print / PDF Export** — One-page A4 invoice with company branding, customer info, itemized table, bank details, and terms
- **Terms & Conditions** — Editable terms panel synced to PDF output
- **Draft Quotations** — Auto-save to local/session storage with revision history
- **Send Email** — Pre-filled mailto with quotation summary to customer
- **Share via WhatsApp** — One-click sharing of quotation summary
- **Settings** — Company profile, bank details, GST number, logo, and user preferences
- **Dashboard** — Quotation history, draft filter, and quick-create

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS |
| State | Zustand |
| Testing | Vitest |
| Linting | Oxlint |

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Tech-Nexvelt/Nexvelt-Quote-Pro.git
cd Nexvelt-Quote-Pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npx vitest run
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── modules/
│   │   ├── dashboard/       # Dashboard & quote history
│   │   ├── print/           # A4PrintableInvoice, PrintModal
│   │   └── settings/        # Company settings, customer details
│   ├── quotePro/            # NexveltQuoteProBuilder (main builder)
│   └── ui/                  # Reusable UI components
├── store/
│   ├── useQuotationStore.ts # Zustand store: quotation state
│   ├── useProjectStore.ts   # Zustand store: project & customer
│   ├── useCompanyStore.ts   # Zustand store: company profile
│   └── useUIStore.ts        # Zustand store: UI modals & toasts
├── types/                   # TypeScript interfaces & enums
├── utils/                   # Currency formatting, number-to-words
└── index.css                # Global styles & print CSS engine
```

---

## 🖨️ Print Layout

The print engine is designed to output a clean, professional A4 invoice (`210mm × 297mm`) in a single page:

- Uses `@media print` CSS with `position: fixed` anchoring at `(0,0)` origin
- Hides all UI chrome; shows only `#quotation-printable-area`
- Logo constrained to `48×48px` to prevent expansion
- All content (header, customer details, items table, bank info, totals, terms, signatures) fits on **1 page**

---

## 📋 Quotation Workflow

```
1. Customer Details   →   Enter customer name, phone, email, site location
2. Scope of Work      →   Select applicable work types (multi-select)
3. Configure Products →   Add item cards with dimensions, rates & custom names
4. Summary            →   Review totals, apply discount/tax, set payment terms
5. Generate & Export  →   Print A4 or Download PDF
```

---

## 🏢 About VLR Interior Solutions

VLR Interior Solutions is a premium modular kitchen and interior design company based in Siddipet, Telangana. Nexvelt Quote Pro was custom-built to streamline their quotation process and deliver professional documentation to clients.

---

## 📄 License

This project is proprietary software owned by **Nexvelt / VLR Interior Solutions**.  
All rights reserved. © 2026 Nexvelt.
