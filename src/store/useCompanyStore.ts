import { create } from 'zustand';
import { CompanyProfile } from '@/types/customer';
import { DEFAULT_COMPANY_PROFILE } from '@/constants/defaultData';
import { LocalStorageAdapter } from '@/storage/localStorageAdapter';

const STORAGE_KEY = 'ice_company_profile';

interface CompanyState {
  company: CompanyProfile;
  updateCompany: (profile: Partial<CompanyProfile>) => void;
  resetCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: LocalStorageAdapter.getItem<CompanyProfile>(STORAGE_KEY, DEFAULT_COMPANY_PROFILE),

  updateCompany: (profile) =>
    set((state) => {
      const updated = { ...state.company, ...profile };
      LocalStorageAdapter.setItem(STORAGE_KEY, updated);
      return { company: updated };
    }),

  resetCompany: () => {
    LocalStorageAdapter.setItem(STORAGE_KEY, DEFAULT_COMPANY_PROFILE);
    set({ company: DEFAULT_COMPANY_PROFILE });
  },
}));
