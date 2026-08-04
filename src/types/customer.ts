export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  projectLocation?: string;
  gstNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  upiId?: string;
  upiQrUrl?: string;
}

export interface CompanyProfile {
  name: string;
  company_name?: string;
  logoUrl?: string;
  tagline?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  gstin?: string;
  tax_id?: string;
  pan?: string;
  bankDetails: BankDetails;
  termsAndConditions: string[];
  quotationTerms?: string;
  warrantyNotes?: string;
  footerMessage?: string;
}
