// Enterprise Form & Security Validation Utilities

export interface PasswordChecklist {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noSequential: boolean;
  noRepeated: boolean;
  noCommon: boolean;
}

export type PasswordStrengthLevel = 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Excellent';

export interface PasswordStrengthResult {
  score: number; // 0 to 6
  level: PasswordStrengthLevel;
  color: string;
  percent: number; // 0 to 100
  checklist: PasswordChecklist;
}

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', '123456789', 'qwerty',
  'admin', 'welcome', 'letmein', 'monkey', '12345', 'pass123',
  'nexvelt', 'furniture', 'interior', '123123', 'abcdef'
];

/**
 * Normalizes email address to lowercase and trims whitespace.
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Validates RFC-compliant email address format.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const normalized = normalizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(normalized);
};

/**
 * Validates phone numbers (supports 10-digit Indian numbers or 7-15 digit international format).
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^[0-9]{10,15}$/.test(cleanPhone);
};

/**
 * Detects sequential patterns like 1234, abcd, qwerty
 */
const hasSequentialPattern = (str: string): boolean => {
  const lower = str.toLowerCase();
  const sequences = ['12345', '23456', '34567', '45678', '56789', 'abcde', 'bcdef', 'cdefg', 'qwerty', 'asdfgh'];
  return sequences.some(seq => lower.includes(seq));
};

/**
 * Detects 3+ repeated characters in a row (e.g. aaaa, 1111)
 */
const hasRepeatedPattern = (str: string): boolean => {
  return /(.)\1{2,}/.test(str);
};

/**
 * Evaluates password strength comprehensively and returns metrics + checklist.
 */
export const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
  const checklist: PasswordChecklist = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-\\/]/.test(password),
    noSequential: !hasSequentialPattern(password),
    noRepeated: !hasRepeatedPattern(password),
    noCommon: !COMMON_PASSWORDS.some(common => password.toLowerCase().includes(common)),
  };

  if (!password) {
    return {
      score: 0,
      level: 'Very Weak',
      color: '#E2E8F0',
      percent: 0,
      checklist,
    };
  }

  let points = 0;

  if (checklist.hasMinLength) points += 1;
  if (password.length >= 12) points += 1;
  if (checklist.hasUppercase) points += 1;
  if (checklist.hasLowercase) points += 1;
  if (checklist.hasNumber) points += 1;
  if (checklist.hasSpecial) points += 1;

  if (!checklist.noCommon) points = Math.max(1, points - 2);
  if (!checklist.noSequential) points = Math.max(1, points - 1);
  if (!checklist.noRepeated) points = Math.max(1, points - 1);

  let level: PasswordStrengthLevel = 'Very Weak';
  let color = '#EF4444'; // Red
  let percent = 15;

  if (points <= 1) {
    level = 'Very Weak';
    color = '#EF4444';
    percent = 20;
  } else if (points === 2) {
    level = 'Weak';
    color = '#F97316'; // Orange
    percent = 40;
  } else if (points === 3) {
    level = 'Fair';
    color = '#F59E0B'; // Amber
    percent = 60;
  } else if (points === 4) {
    level = 'Good';
    color = '#3B82F6'; // Blue
    percent = 80;
  } else if (points === 5) {
    level = 'Strong';
    color = '#00B8B8'; // Teal
    percent = 92;
  } else {
    level = 'Excellent';
    color = '#10B981'; // Emerald Green
    percent = 100;
  }

  return {
    score: points,
    level,
    color,
    percent,
    checklist,
  };
};

/**
 * Checks if two passwords match case-sensitively.
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
