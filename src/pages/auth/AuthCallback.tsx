import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { OnboardingService } from '@/services/onboarding.service';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { logger } from '@/utils/logger';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Mail } from 'lucide-react';

export type CallbackFlowType =
  | 'signup'
  | 'recovery'
  | 'magiclink'
  | 'email_change'
  | 'invite'
  | 'oauth'
  | 'unknown';

export interface CallbackState {
  status: 'processing' | 'success' | 'error';
  flowType: CallbackFlowType;
  message: string;
  errorMessage?: string;
  errorType?: 'expired' | 'invalid' | 'missing' | 'unknown';
}

export const AuthCallback: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Authenticating...');
  const navigate = useNavigate();
  const { initializeSession } = useAuthStore();

  const [state, setState] = useState<CallbackState>({
    status: 'processing',
    flowType: 'unknown',
    message: 'Verifying your authentication & establishing session...',
  });

  useEffect(() => {
    let isMounted = true;

    const processAuthCallback = async () => {
      logger.info('Processing authentication callback URL');

      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setState({
            status: 'success',
            flowType: 'signup',
            message: 'Session verified. Launching workspace...',
          });
          setTimeout(() => navigate('/dashboard'), 800);
        }
        return;
      }

      try {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const hash = url.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        // 1. Detect URL Errors returned from Supabase
        const error = searchParams.get('error') || hashParams.get('error');
        const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error || errorCode) {
          logger.warn('Auth callback returned error from Supabase', { error, errorCode, errorDescription });
          const isExpired = errorCode === 'otp_expired' || (errorDescription && errorDescription.toLowerCase().includes('expired'));
          
          if (isMounted) {
            setState({
              status: 'error',
              flowType: 'unknown',
              message: 'Authentication Link Invalid or Expired',
              errorMessage: isExpired
                ? 'This verification link has expired or has already been used. Please request a new link.'
                : 'The authentication link is invalid. Please log in or request a new verification link.',
              errorType: isExpired ? 'expired' : 'invalid',
            });
          }
          return;
        }

        // 2. Detect Callback Flow Type (recovery, signup, magiclink, email_change, invite, oauth)
        const typeParam = (searchParams.get('type') || hashParams.get('type') || '').toLowerCase();
        let detectedFlow: CallbackFlowType = 'unknown';

        if (typeParam === 'recovery' || hash.includes('type=recovery')) {
          detectedFlow = 'recovery';
        } else if (typeParam === 'signup' || typeParam === 'invite' || hash.includes('type=signup')) {
          detectedFlow = 'signup';
        } else if (typeParam === 'magiclink' || hash.includes('type=magiclink')) {
          detectedFlow = 'magiclink';
        } else if (typeParam === 'email_change' || hash.includes('type=email_change')) {
          detectedFlow = 'email_change';
        } else if (searchParams.has('code') || hash.includes('access_token')) {
          detectedFlow = 'oauth';
        }

        // 3. Handle PKCE Code Exchange if ?code= is present in URL
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            logger.error('Failed to exchange code for session', { error: exchangeError });
            if (isMounted) {
              setState({
                status: 'error',
                flowType: detectedFlow,
                message: 'Session Exchange Failed',
                errorMessage: 'We could not verify your authentication code. The link may be expired.',
                errorType: 'expired',
              });
            }
            return;
          }
        }

        // 4. Retrieve & Validate Active Authenticated Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user || !session.access_token) {
          logger.warn('No valid active session found after callback processing');
          if (isMounted) {
            setState({
              status: 'error',
              flowType: detectedFlow,
              message: 'Authentication Session Missing',
              errorMessage: 'Your session could not be established. Please log in with your credentials.',
              errorType: 'missing',
            });
          }
          return;
        }

        // 5. Clean URL Parameters immediately to strip tokens and code from address bar & browser history
        window.history.replaceState({}, document.title, window.location.pathname);

        // 6. Handle Password Recovery Redirect
        if (detectedFlow === 'recovery') {
          if (isMounted) {
            setState({
              status: 'success',
              flowType: 'recovery',
              message: 'Recovery session verified. Redirecting to password reset...',
            });
          }
          setTimeout(() => navigate('/reset-password'), 800);
          return;
        }

        // 7. Check Onboarding Status (NO RECORD PROVISIONING INSIDE CALLBACK)
        const userId = session.user.id;
        const { isComplete } = await OnboardingService.checkOnboardingStatus(userId);

        // 8. Synchronize Global Auth State
        await initializeSession();

        if (isMounted) {
          let successMsg = 'Authentication verified successfully!';
          if (detectedFlow === 'signup') successMsg = 'Email confirmed! Directing to workspace...';
          if (detectedFlow === 'magiclink') successMsg = 'Magic Link verified! Directing to dashboard...';
          if (detectedFlow === 'email_change') successMsg = 'Email updated successfully!';

          setState({
            status: 'success',
            flowType: detectedFlow,
            message: successMsg,
          });

          setTimeout(() => {
            if (!isComplete) {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          }, 1000);
        }

      } catch (err: any) {
        logger.error('Unexpected error during auth callback processing', { error: err });
        if (isMounted) {
          setState({
            status: 'error',
            flowType: 'unknown',
            message: 'Authentication Error',
            errorMessage: err?.message || 'An unexpected error occurred while verifying your account.',
            errorType: 'unknown',
          });
        }
      }
    };

    processAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, initializeSession]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-[#111827] select-none">
      
      {/* Centered Loading & Callback Status Card */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[28px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-6 text-center relative z-10">
        
        {/* Branding Logo */}
        <div className="flex items-center justify-center gap-2.5">
          <img
            src="/nexvelt_logo.png"
            alt="Nexvelt Logo"
            className="w-9 h-9 object-contain drop-shadow-sm"
          />
          <div className="text-left leading-none">
            <span className="font-extrabold text-base text-[#111827] block">Nexvelt</span>
            <span className="text-[9px] font-bold text-[#00B8B8] uppercase tracking-wider block mt-0.5">
              QUOTE PRO
            </span>
          </div>
        </div>

        {/* Processing State */}
        {state.status === 'processing' && (
          <div className="space-y-4 py-4" aria-live="polite">
            <div className="w-16 h-16 bg-[#E6F7F7] border border-[#00D9D9]/30 rounded-full flex items-center justify-center mx-auto text-[#00B8B8] shadow-2xs">
              <Loader2 className="w-8 h-8 animate-spin text-[#00B8B8]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#111827]">Verifying Account</h3>
              <p className="text-xs font-semibold text-[#6B7280] max-w-xs mx-auto leading-relaxed">
                {state.message}
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {state.status === 'success' && (
          <div className="space-y-4 py-4" aria-live="polite">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#111827]">Authentication Verified</h3>
              <p className="text-xs font-bold text-emerald-700 max-w-xs mx-auto leading-relaxed">
                {state.message}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <div className="space-y-5 py-2" aria-live="assertive">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-2xs">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-[#111827]">{state.message}</h3>
              <p className="text-xs font-medium text-[#4B5563] leading-relaxed max-w-xs mx-auto">
                {state.errorMessage}
              </p>
            </div>

            {/* Recovery Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full h-11 bg-[#00B8B8] hover:bg-[#009999] text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span>Return to Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full h-11 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#6B7280]" />
                <span>Request New Verification Link</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
