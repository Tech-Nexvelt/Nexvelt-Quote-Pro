import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { AuthService } from '@/services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  Send,
  Lock,
  ShieldCheck,
  Zap,
  Headset,
  Cloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Reset Password');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await AuthService.resetPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row font-sans text-[#111827] select-none overflow-hidden relative">
      
      {/* ========================================================= */}
      {/* 1. LEFT PANEL: Visual Hero Section & Brand Features       */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[52%] relative bg-white p-8 lg:p-12 xl:p-14 flex flex-col justify-between h-full overflow-hidden border-r border-[#E2E8F0]">
        
        {/* Interior Hero Background Image placed on the right side of the left panel */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none z-0 hidden lg:block select-none">
          <img
            src="/furniture_hero.png"
            alt="Nexvelt Interior Scene"
            className="w-full h-full object-cover object-right"
          />
          {/* Smooth gradient fading into pure white on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-40% to-transparent" />
        </div>

        {/* Mobile/Tablet Background */}
        <div className="absolute inset-0 z-0 pointer-events-none lg:hidden opacity-10 select-none">
          <img
            src="/furniture_hero.png"
            alt="Interior Background Mobile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top Content Area */}
        <div className="space-y-7 relative z-10">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/nexvelt_logo.png"
              alt="Nexvelt Logo"
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div className="leading-none">
              <span className="font-extrabold text-lg tracking-tight text-[#111827] block">
                Nexvelt
              </span>
              <span className="text-[9px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-0.5">
                QUOTE PRO
              </span>
            </div>
          </div>

          {/* Copywriting Header */}
          <div className="space-y-2.5 pt-1 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] bg-[#00B8B8]" />
              <span className="text-[10px] font-extrabold text-[#00B8B8] tracking-widest uppercase block">
                SMART QUOTES. STRONGER BUSINESS.
              </span>
            </div>

            <h1 className="text-3xl lg:text-[40px] font-black text-[#111827] tracking-tight leading-[1.15]">
              Professional Quotes. <br />
              <span className="text-[#00B8B8]">Beautifully Simple.</span>
            </h1>

            <p className="text-xs lg:text-sm font-medium text-[#4B5563] leading-relaxed max-w-sm pt-0.5">
              Create accurate quotations in minutes, impress your customers and grow your furniture business.
            </p>
          </div>

          {/* Three Feature List Rows */}
          <div className="space-y-4 max-w-md pt-2">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Secure &amp; Trusted</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                  Your data is safe with enterprise-grade security and encryption.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <Zap className="w-5 h-5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Fast &amp; Effortless</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                  Reset your password in a few simple steps and get back to work.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#00B8B8] shrink-0">
                <Headset className="w-5 h-5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Always Here to Help</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                  Our support team is ready to assist you anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Trust Card */}
          <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-3.5 px-4 rounded-2xl shadow-xs max-w-xs space-y-1.5 mt-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#00D9D9] text-white text-[10px] font-black tracking-wide">
                10K+
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#4B5563] leading-tight">
              Trusted by <span className="text-[#111827] font-extrabold">10,000+</span> Furniture Dealers, Carpenters &amp; Interior Professionals
            </p>
          </div>
        </div>

        {/* Bottom Enterprise Features Bar */}
        <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] text-[#6B7280] font-semibold relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F7] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div className="leading-none">
              <span className="text-[#111827] block font-bold text-[11px]">Enterprise Grade Security</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">256-bit SSL Encrypted</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F7] flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div className="leading-none">
              <span className="text-[#111827] block font-bold text-[11px]">Cloud Based</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">Access from Anywhere</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F7] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div className="leading-none">
              <span className="text-[#111827] block font-bold text-[11px]">Reliable &amp; Fast</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">99.9% Uptime Guaranteed</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F7] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div className="leading-none">
              <span className="text-[#111827] block font-bold text-[11px]">Your Data, Always Safe</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">We never share your information</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RIGHT PANEL: Centered Auth Card                        */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[48%] bg-[#F8FAFC] relative flex flex-col justify-between items-center p-6 lg:p-12 h-full overflow-y-auto">
        <div /> {/* Top spacer */}

        {/* Floating White Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[430px] bg-white border border-[#E2E8F0] rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10 my-auto"
        >
          {/* Logo Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5">
              <img
                src="/nexvelt_logo.png"
                alt="Nexvelt Logo"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
              <div className="text-left leading-none">
                <span className="font-extrabold text-base text-[#111827] block">Nexvelt</span>
                <span className="text-[9px] font-bold text-[#00B8B8] uppercase tracking-wider block mt-0.5">
                  QUOTE PRO
                </span>
              </div>
            </div>

            {/* Cyan Lock Circle Badge */}
            <div className="w-14 h-14 bg-[#E6F7F7] border border-[#00D9D9]/30 rounded-full flex items-center justify-center text-[#00B8B8] mt-6 mb-4 shadow-2xs">
              <Lock className="w-6 h-6 stroke-[1.8] text-[#00B8B8]" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-black text-[#111827] tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-xs font-medium text-[#6B7280] max-w-[300px] mt-2 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form / Success view */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 space-y-5"
              >
                <div className="bg-[#E6F7F7] border border-[#00D9D9]/30 p-4 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#00D9D9]/20 flex items-center justify-center mx-auto text-[#008080]">
                    <CheckCircle2 className="w-6 h-6 text-[#008080]" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#111827]">Reset Link Sent!</h4>
                  <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                    If an account exists for this email address, a password reset link has been sent.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full h-11 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send to another email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Email Address Field */}
                <div>
                  <label htmlFor="reset-email" className="block text-xs font-bold text-[#374151] mb-1.5 text-left">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email address"
                      className={`w-full h-11 pl-10 pr-4 text-xs bg-white border rounded-xl text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none transition-all ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-[#E2E8F0] focus:border-[#00B8B8] focus:ring-2 focus:ring-[#00B8B8]/20'
                      }`}
                      aria-label="Email Address"
                      required
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#00B8B8] hover:bg-[#009999] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#00B8B8]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <Send className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                  <span className="text-xs font-medium text-[#9CA3AF]">or</span>
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                </div>

                {/* Secondary Button */}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full h-11 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#374151] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#374151]" />
                  <span>Back to Sign In</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Help Section */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs font-semibold text-[#6B7280]">
          <Headset className="w-4 h-4 text-[#6B7280]" />
          <span>Need help?</span>
          <Link to="/legal/contact" className="text-[#00B8B8] font-bold hover:underline">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
};
