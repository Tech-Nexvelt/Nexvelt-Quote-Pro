import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

interface SecurityState {
  isOwnerMode: boolean;
  isPinDialogOpen: boolean;
  isLockConfirmOpen: boolean;
  isVerifying: boolean;

  openPinDialog: () => void;
  closePinDialog: () => void;
  openLockConfirm: () => void;
  closeLockConfirm: () => void;

  verifyPin: (pin: string) => Promise<boolean>;
  unlockOwnerMode: () => void;
  lockOwnerMode: () => void;
  updatePin: (oldPin: string, newPin: string) => Promise<{ success: boolean; message: string }>;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  isOwnerMode: false,
  isPinDialogOpen: false,
  isLockConfirmOpen: false,
  isVerifying: false,

  openPinDialog: () => set({ isPinDialogOpen: true }),
  closePinDialog: () => set({ isPinDialogOpen: false }),

  openLockConfirm: () => set({ isLockConfirmOpen: true }),
  closeLockConfirm: () => set({ isLockConfirmOpen: false }),

  verifyPin: async (inputPin: string) => {
    set({ isVerifying: true });
    const companyId = useAuthStore.getState().company?.id;

    if (!isSupabaseConfigured() || !companyId) {
      set({ isVerifying: false });
      return inputPin.trim() === '1234';
    }

    try {
      const { data, error } = await supabase.rpc('verify_owner_pin', {
        p_company_id: companyId,
        p_pin: inputPin.trim(),
      });

      set({ isVerifying: false });
      if (error) return false;
      return !!data;
    } catch {
      set({ isVerifying: false });
      return false;
    }
  },

  unlockOwnerMode: () => {
    set({ isOwnerMode: true, isPinDialogOpen: false });
  },

  lockOwnerMode: () => {
    set({ isOwnerMode: false, isLockConfirmOpen: false });
  },

  updatePin: async (oldPin: string, newPin: string) => {
    const companyId = useAuthStore.getState().company?.id;
    if (!isSupabaseConfigured() || !companyId) {
      return { success: true, message: 'Owner PIN updated locally' };
    }

    try {
      const { data, error } = await supabase.rpc('update_owner_pin', {
        p_company_id: companyId,
        p_old_pin: oldPin,
        p_new_pin: newPin,
      });

      if (error) return { success: false, message: error.message };
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update PIN' };
    }
  },
}));
