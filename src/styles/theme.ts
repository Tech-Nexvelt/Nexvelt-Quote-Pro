/**
 * Official Nexvelt Design System Tokens
 * Single source of truth for application colors, radii, and typography.
 */
export const NEXVELT_THEME = {
  colors: {
    primary: '#00D9D9',
    primaryHover: '#00B8B8',
    secondary: '#00B8B8',
    accent: '#35F5FF',
    softTealBg: '#E0F7F7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    divider: '#F1F5F9',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#94A3B8',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
  },
  borderRadius: {
    card: '18px',
    input: '12px',
    button: '12px',
    pill: '9999px',
  },
  shadows: {
    card: '0 2px 12px rgba(15,23,42,0.05)',
    glow: '0 0 25px -5px rgba(0,217,217,0.15)',
  },
} as const;
