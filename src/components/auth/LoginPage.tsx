import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { normalizeEmail } from '@/utils/validation';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Calculator, FileText, ArrowRight, Cloud, Users, Loader2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Login');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(cleanEmail, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await login('google.user@nexvelt.com', 'google123');
      navigate('/dashboard');
    } catch {
      setError('Google Sign In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans text-[#111827] select-none overflow-hidden">
      
      {/* 1. LEFT PANEL: Branding & Visuals (Takes 7 columns / 58% of space) */}
      <div className="w-full lg:w-[58%] relative bg-white p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between min-h-screen overflow-hidden">
        
        {/* Continuous Background Image positioned on the right side of the Left Panel */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none z-0 hidden lg:block select-none">
          <img
            src="/furniture_hero.png"
            alt="Modular Kitchen Scene"
            className="w-full h-full object-cover object-left"
          />
          {/* Smooth white gradient overlay fading image to pure white on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-40% to-transparent" />
        </div>

        {/* Mobile/Tablet Background Image (faded) */}
        <div className="absolute inset-0 z-0 pointer-events-none lg:hidden opacity-10 select-none">
          <img
            src="/furniture_hero.png"
            alt="Modular Kitchen Scene Mobile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Logo & Content Overlaid */}
        <div className="space-y-12 relative z-10">
          {/* Top Logo */}
          <div className="flex items-center gap-3.5">
            <img
              src="/vlr_traders_logo.jpg"
              alt="VLR Traders Logo"
              className="w-12 h-12 object-contain drop-shadow-md rounded-full border border-white/20"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/nexvelt_logo.png'; }}
            />
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#111827] block leading-none">
                Nexvelt
              </span>
              <span className="text-[10px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-1">
                QUOTE PRO
              </span>
            </div>
          </div>

          {/* Copywriting Header */}
          <div className="space-y-4 pt-2">
            <span className="text-[11px] font-extrabold text-[#00B8B8] tracking-widest uppercase block">
              — SMART QUOTES. STRONGER BUSINESS.
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.12]">
              Professional Quotes. <br />
              <span className="text-[#00B8B8]">Beautifully Simple.</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#4B5563] leading-relaxed max-w-md pt-1">
              Create accurate quotations in minutes, impress your customers and grow your furniture business.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="space-y-4 max-w-md pt-2">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <FileText className="w-4 h-4 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Fast & Easy Quotation</h4>
                <p className="text-[10px] text-[#6B7280] font-semibold mt-0.5">Create professional quotes in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <Calculator className="w-4 h-4 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Accurate & Transparent</h4>
                <p className="text-[10px] text-[#6B7280] font-semibold mt-0.5">Real-time calculations and clear pricing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Secure & Reliable</h4>
                <p className="text-[10px] text-[#6B7280] font-semibold mt-0.5">Your data is safe with enterprise security</p>
              </div>
            </div>
          </div>

          {/* Floating Trusted Badge */}
          <div className="inline-flex items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-2xs max-w-sm">
            <div className="w-10 h-10 rounded-full bg-[#E6F7F7] flex items-center justify-center text-[#00B8B8] shrink-0">
              <Users className="w-5 h-5 text-[#00B8B8]" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-extrabold text-[#008080] block">Trusted by 10,000+</span>
              <span className="text-[10px] text-[#4B5563] font-semibold block mt-0.5">Furniture Dealers, Carpenters & Interior Professionals</span>
            </div>
          </div>
        </div>

        {/* Footer info badges */}
        <div className="pt-8 border-t border-[#F1F5F9] flex flex-wrap items-center gap-6 text-[11px] text-[#6B7280] font-semibold mt-8 relative z-10">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-[#00B8B8]" />
            <div>
              <span className="text-[#111827] block leading-tight">Enterprise Grade Security</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">256-bit SSL Encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4.5 h-4.5 text-[#00B8B8]" />
            <div>
              <span className="text-[#111827] block leading-tight">Cloud Based</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">Access from Anywhere</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: Floating Form Card Container (Takes 5 columns / 42% of space) */}
      <div className="w-full lg:w-[42%] bg-[#F8FAFC] relative flex flex-col justify-between items-center p-8 sm:p-12 lg:p-16 xl:p-20 overflow-y-auto border-l border-[#E2E8F0] min-h-screen">
        
        {/* Subtle dot grid pattern on the right edge */}
        <div className="absolute right-4 top-1/4 bottom-1/4 w-8 pointer-events-none opacity-20 flex flex-col justify-between text-[#9CA3AF] text-xs select-none">
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
          <span>• • • •</span>
        </div>

        <div />

        {/* Floating white card with deep shadow */}
        <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-6 relative z-10">
          
          {/* Card Header Logo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/nexvelt_logo.png"
                alt="Nexvelt Logo"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <div className="text-left">
                <span className="font-extrabold text-base text-[#111827] block leading-none">Nexvelt</span>
                <span className="text-[10px] font-bold text-[#00B8B8] tracking-wider uppercase block mt-0.5">QUOTE PRO</span>
              </div>
            </div>
            <h2 className="text-xl font-black text-[#111827]">Welcome</h2>
            <p className="text-xs font-semibold text-[#6B7280]">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-bold text-[#111827] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((prev) => normalizeEmail(prev))}
                  placeholder="Enter your email"
                  className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#00D9D9] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password-input" className="block text-xs font-bold text-[#111827]">Password</label>
                {isCapsLockOn && (
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Caps Lock ON
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-11 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#00D9D9] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password Link */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#00D9D9] focus:ring-0 cursor-pointer w-4 h-4 border-[#CBD5E1]"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#00B8B8] font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">or continue with</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full h-11 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-70"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Register Link */}
          <div className="text-center text-xs font-semibold text-[#4B5563] pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00B8B8] font-extrabold hover:underline">
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-semibold text-center flex items-center justify-center gap-1.5 mt-6">
          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>
            By continuing, you agree to Nexvelt Quote Pro's{' '}
            <Link to="/legal/terms-of-service" className="text-[#00B8B8] font-bold hover:underline">Terms of Service</Link>,{' '}
            <Link to="/legal/privacy-policy" className="text-[#00B8B8] font-bold hover:underline">Privacy Policy</Link>, and{' '}
            <Link to="/legal" className="text-[#00B8B8] font-bold hover:underline">Trust Center</Link>
          </span>
        </div>
      </div>

    </div>
  );
};
