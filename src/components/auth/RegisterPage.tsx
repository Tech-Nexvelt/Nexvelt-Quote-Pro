import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  evaluatePasswordStrength,
  isValidEmail,
  isValidPhone,
  doPasswordsMatch,
  normalizeEmail,
} from '@/utils/validation';
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ChevronDown, 
  Check, 
  ArrowRight, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  Cloud,
  Armchair,
  Hammer,
  Layout,
  Wrench,
  Store,
  Loader2,
  AlertCircle,
  XCircle
} from 'lucide-react';

const BUSINESS_OPTIONS = [
  { id: 'Furniture Dealer', label: 'Furniture Dealer', icon: Store },
  { id: 'Interior Contractor', label: 'Interior Contractor', icon: Armchair },
  { id: 'Carpenter', label: 'Carpenter', icon: Hammer },
  { id: 'Modular Kitchen', label: 'Modular Kitchen', icon: Layout },
  { id: 'Workshop', label: 'Workshop', icon: Wrench },
];

export const RegisterPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Create Account');
  const navigate = useNavigate();
  const { register } = useAuthStore();

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Furniture Dealer');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI & Security State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Touched Fields Tracking
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Input Element Refs for Auto-Focus on Error
  const companyRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time Field Validations
  const isCompanyValid = companyName.trim().length >= 2;
  const isOwnerValid = ownerName.trim().length >= 2;
  const isEmailValid = isValidEmail(email);
  const isPhoneValid = isValidPhone(phone);
  const strength = evaluatePasswordStrength(password);
  const isPasswordEnough = password.length >= 8;
  const isPasswordMatching = confirmPassword.length > 0 ? doPasswordsMatch(password, confirmPassword) : true;
  const isConfirmPasswordValid = confirmPassword.length > 0 && isPasswordMatching;

  // Inline Field Errors
  const companyError = touched.companyName && !isCompanyValid ? 'Company name is required (min 2 characters).' : '';
  const ownerError = touched.ownerName && !isOwnerValid ? 'Owner name is required (min 2 characters).' : '';
  const emailError = touched.email && !isEmailValid ? 'Please enter a valid email address.' : '';
  const phoneError = touched.phone && !isPhoneValid ? 'Please enter a valid phone number.' : '';
  const passwordError = touched.password && !isPasswordEnough ? 'Password must be at least 8 characters.' : '';
  const confirmPasswordError = (touched.confirmPassword || confirmPassword.length > 0) && !isPasswordMatching ? 'Passwords do not match.' : '';

  // Master Form Validity
  const isFormValid =
    isCompanyValid &&
    isOwnerValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordEnough &&
    isPasswordMatching &&
    confirmPassword.length >= 8 &&
    agreed;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Mark all as touched to display validation highlights if user forces submit
    setTouched({
      companyName: true,
      ownerName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!isCompanyValid) {
      companyRef.current?.focus();
      return;
    }
    if (!isOwnerValid) {
      ownerRef.current?.focus();
      return;
    }
    if (!isEmailValid) {
      emailRef.current?.focus();
      return;
    }
    if (!isPhoneValid) {
      phoneRef.current?.focus();
      return;
    }
    if (!isPasswordEnough) {
      passwordRef.current?.focus();
      return;
    }
    if (!isPasswordMatching) {
      confirmPasswordRef.current?.focus();
      return;
    }
    if (!agreed) {
      setSubmitError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        companyName: companyName.trim(),
        ownerName: ownerName.trim(),
        email: normalizeEmail(email),
        phone: phone.trim() || undefined,
        businessType,
        password, // Raw case-sensitive untrimmed password
      });
      navigate('/onboarding');
    } catch (err: any) {
      setSubmitError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBusinessObj = BUSINESS_OPTIONS.find(b => b.id === businessType) || BUSINESS_OPTIONS[0];
  const SelectedIcon = selectedBusinessObj.icon;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row font-sans text-[#111827] select-none overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. LEFT PANEL: Branding & Visual Hero Section (54% width) */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[54%] relative bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between min-h-screen overflow-hidden border-r border-[#E2E8F0]">
        
        {/* Hero Dining Room Background Image */}
        <div className="absolute right-0 top-0 bottom-0 w-[58%] pointer-events-none z-0 hidden lg:block select-none">
          <img
            src="/furniture_hero_dining.png"
            alt="Luxury Interior Dining Room with Ring Lights"
            className="w-full h-full object-cover object-left-center"
          />
          {/* Smooth gradient overlay fading image to pure white on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 via-35% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />
        </div>

        {/* Mobile Background */}
        <div className="absolute inset-0 z-0 pointer-events-none lg:hidden opacity-10 select-none">
          <img
            src="/furniture_hero_dining.png"
            alt="Interior Dining Scene Mobile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top Branding Stack */}
        <div className="space-y-8 relative z-10">
          
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/nexvelt_logo.png"
              alt="Nexvelt Logo"
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <div className="leading-none">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#111827] block">
                Nexvelt
              </span>
              <span className="text-[9px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-0.5">
                QUOTE PRO
              </span>
            </div>
          </div>

          {/* Copywriting Header */}
          <div className="space-y-3 pt-1 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-[#00B8B8]" />
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#00B8B8] tracking-widest uppercase block">
                SMART QUOTES. STRONGER BUSINESS.
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#111827] tracking-tight leading-[1.12]">
              Professional Quotes. <br />
              <span className="text-[#00B8B8]">Beautifully Simple.</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-[#4B5563] leading-relaxed max-w-md pt-0.5">
              Create accurate quotations in minutes, impress your customers and grow your furniture business.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="space-y-3.5 max-w-md pt-1">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#00B8B8] shrink-0 shadow-2xs">
                <FileText className="w-4.5 h-4.5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Fast &amp; Easy Quotation</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Create professional quotes in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#00B8B8] shrink-0 shadow-2xs">
                <Calculator className="w-4.5 h-4.5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Accurate &amp; Transparent</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Real-time calculations and clear pricing</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#00B8B8] shrink-0 shadow-2xs">
                <ShieldCheck className="w-4.5 h-4.5 text-[#00B8B8]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Professional &amp; Reliable</h4>
                <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Trusted by furniture professionals</p>
              </div>
            </div>
          </div>

          {/* Floating Customer Trust Badge */}
          <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-3.5 px-4 rounded-2xl shadow-sm max-w-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#00D9D9] text-white text-[10px] font-black tracking-wide shadow-xs">
                10K+
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#4B5563] leading-snug">
              Trusted by <span className="text-[#111827] font-extrabold">10,000+</span> Furniture Dealers, Carpenters &amp; Interior Professionals
            </p>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-6 border-t border-[#F1F5F9] flex flex-wrap items-center gap-8 text-[11px] text-[#6B7280] font-semibold mt-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-[#00B8B8] shrink-0" />
            <div>
              <span className="text-[#111827] block leading-tight font-extrabold">Enterprise Grade Security</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">256-bit SSL Encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4.5 h-4.5 text-[#00B8B8] shrink-0" />
            <div>
              <span className="text-[#111827] block leading-tight font-extrabold">Cloud Based</span>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">Access from Anywhere</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RIGHT PANEL: Floating Form Card Container (46% width)  */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[46%] bg-[#F8FAFC] relative flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
        
        {/* Floating White Signup Card */}
        <div className="w-full max-w-[510px] bg-white border border-[#E2E8F0] rounded-[24px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-4 my-auto relative z-10">
          
          {/* Card Header Logo & Title */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2">
              <img
                src="/nexvelt_logo.png"
                alt="Nexvelt Logo"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
              <div className="text-left leading-none">
                <span className="font-extrabold text-sm text-[#111827] block">Nexvelt</span>
                <span className="text-[9px] font-bold text-[#00B8B8] uppercase tracking-wider block mt-0.5">QUOTE PRO</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">Create Your Account</h2>
              <p className="text-xs font-semibold text-[#6B7280]">Start your journey with Nexvelt Quote Pro</p>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            
            {/* Row 1: Company Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Company Name *</label>
                <div className="relative">
                  <Building2 className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${companyError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    ref={companyRef}
                    type="text"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => handleBlur('companyName')}
                    placeholder="Enter company name"
                    aria-invalid={!!companyError}
                    className={`w-full h-10 pl-9 pr-3 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                      companyError
                        ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                    }`}
                    required
                  />
                </div>
                {companyError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{companyError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Business Name</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoComplete="organization-title"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#00B8B8] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Owner Name & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Owner Name *</label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${ownerError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    ref={ownerRef}
                    type="text"
                    autoComplete="name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    onBlur={() => handleBlur('ownerName')}
                    placeholder="Enter owner name"
                    aria-invalid={!!ownerError}
                    className={`w-full h-10 pl-9 pr-3 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                      ownerError
                        ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                    }`}
                    required
                  />
                </div>
                {ownerError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{ownerError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      setEmail((prev) => normalizeEmail(prev));
                      handleBlur('email');
                    }}
                    placeholder="Enter email address"
                    aria-invalid={!!emailError}
                    className={`w-full h-10 pl-9 pr-3 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                      emailError
                        ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                    }`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Phone Number & Business Type Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Phone Number</label>
                <div className="flex gap-1.5">
                  <div className="h-10 px-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-xs font-bold text-[#111827] shrink-0 gap-1">
                    <span>+91</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      ref={phoneRef}
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="Enter phone number"
                      aria-invalid={!!phoneError}
                      className={`w-full h-10 px-3 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                        phoneError
                          ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                      }`}
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              {/* Custom Interactive Business Type Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-[#111827] mb-1">Business Type</label>
                
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#00B8B8] rounded-xl text-[#111827] font-semibold flex items-center justify-between shadow-2xs focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <SelectedIcon className="w-4 h-4 text-[#00B8B8] shrink-0" />
                    <span className="truncate">{businessType || 'Select business type'}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Options Popup List */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1">
                    {BUSINESS_OPTIONS.map((opt) => {
                      const OptIcon = opt.icon;
                      const isSelected = businessType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setBusinessType(opt.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#E6F7F7] text-[#008080] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <OptIcon className={`w-4 h-4 ${isSelected ? 'text-[#008080]' : 'text-slate-400'}`} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Password *</label>
                  {isCapsLockOn && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Caps Lock ON
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="Enter password"
                    aria-invalid={!!passwordError}
                    className={`w-full h-10 pl-9 pr-9 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                      passwordError
                        ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Confirm Password *</label>
                  {isCapsLockOn && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Caps Lock ON
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${confirmPasswordError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="Confirm password"
                    aria-invalid={!!confirmPasswordError}
                    className={`w-full h-10 pl-9 pr-9 text-xs bg-white border rounded-xl font-medium placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                      confirmPasswordError
                        ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : isConfirmPasswordValid
                        ? 'border-emerald-500 text-[#111827] focus:border-emerald-500'
                        : 'border-[#E2E8F0] text-[#111827] focus:border-[#00B8B8]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordError ? (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{confirmPasswordError}</span>
                  </p>
                ) : isConfirmPasswordValid ? (
                  <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Passwords match perfectly</span>
                  </p>
                ) : null}
              </div>
            </div>

            {/* Password Strength Meter & Live Checklist */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#6B7280]">Password strength</span>
                <span className="font-extrabold transition-colors duration-200" style={{ color: strength.color }}>
                  {strength.level}
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${strength.percent}%`,
                    backgroundColor: strength.color,
                  }}
                />
              </div>

              {/* Password Checklist Rules */}
              <div className="space-y-1 text-[11px] font-medium pt-1">
                <div className={`flex items-center gap-1.5 transition-colors ${strength.checklist.hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {strength.checklist.hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>At least 8 characters</span>
                </div>

                <div className={`flex items-center gap-1.5 transition-colors ${strength.checklist.hasUppercase && strength.checklist.hasLowercase ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {strength.checklist.hasUppercase && strength.checklist.hasLowercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>Include uppercase &amp; lowercase letters</span>
                </div>

                <div className={`flex items-center gap-1.5 transition-colors ${strength.checklist.hasNumber || strength.checklist.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {strength.checklist.hasNumber || strength.checklist.hasSpecial ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>Include number or special character</span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4B5563] pt-0.5">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#00B8B8] focus:ring-0 cursor-pointer w-4 h-4"
              />
              <label htmlFor="agree" className="cursor-pointer">
                I agree to the{' '}
                <Link to="/legal/terms-of-service" className="text-[#00B8B8] font-bold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/legal/privacy-policy" className="text-[#00B8B8] font-bold hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full h-11 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                !isFormValid || isSubmitting
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
                  : 'bg-[#00B8B8] hover:bg-[#009999] text-white shadow-md shadow-[#00B8B8]/20 cursor-pointer active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account &amp; Workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account? Sign In */}
          <div className="text-center text-xs font-semibold text-[#4B5563] pt-0.5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00B8B8] font-extrabold hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
