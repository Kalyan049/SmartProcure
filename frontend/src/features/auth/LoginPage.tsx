/**
 * LoginPage — Module 5: Authentication & Role-Based Access
 *
 * Two-step mobile + OTP login flow:
 *   Step 1: Enter 10-digit mobile number → SEND OTP
 *   Step 2: Enter 6-digit OTP → VERIFY & CONTINUE
 *
 * Uses real auth service via useAuth(). OTP is simulated in MVP (use 123456).
 * Post-login redirects to role-appropriate dashboard.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

// ─── OTP Input (6 auto-advancing single-digit boxes) ─────────────────────────

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, disabled }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const handleChange = (idx: number, char: string) => {
    const clean = char.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = clean;
    const newVal = newDigits.join('').trim();
    onChange(newVal);
    if (clean && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputs.current[idx] = el; }}
          id={`otp-digit-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          aria-label={`OTP digit ${idx + 1}`}
          className={[
            'w-11 h-12 text-center text-lg font-bold rounded-lg border-2 outline-none transition-all',
            'bg-white text-text-primary',
            digit
              ? 'border-brand-primary bg-brand-light'
              : 'border-surface-border hover:border-brand-primary/50',
            'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          ].join(' ')}
        />
      ))}
    </div>
  );
};

// ─── LoginPage ────────────────────────────────────────────────────────────────

type LoginStep = 'mobile' | 'otp';

export const LoginPage: React.FC = () => {
  const { sendOtp, verifyOtpAndLogin, authError, clearError, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<LoginStep>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const defaultPath =
        role === 'OFFICER' ? '/officer/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard';
      navigate(from || defaultPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const displayError = localError || authError;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const trimmed = mobile.trim();
    if (!/^\d{10}$/.test(trimmed)) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSending(true);
    try {
      const result = await sendOtp(trimmed);
      if (result.success) {
        setStep('otp');
        setResendTimer(30);
      } else {
        setLocalError(result.error || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (otp.length !== 6) {
      setLocalError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyOtpAndLogin(mobile.trim(), otp);
      if (result.success) {
        // Redirect is handled by the useEffect above watching isAuthenticated
      } else {
        setLocalError(result.error || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLocalError(null);
    setOtp('');
    setIsSending(true);
    try {
      await sendOtp(mobile.trim());
      setResendTimer(30);
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    setStep('mobile');
    setOtp('');
    setLocalError(null);
    clearError();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* ── Logo & Header ─────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Sprout className="w-8 h-8 text-brand-mint" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">SmartProcure</h1>
          <p className="text-xs text-text-secondary mt-1">
            Right Information. Less Waiting. Brighter Tomorrows.
          </p>
        </div>

        {/* ── Main Card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">

          {/* Progress bar */}
          <div className="h-1 bg-surface-border">
            <div
              className="h-full bg-brand-primary transition-all duration-500"
              style={{ width: step === 'mobile' ? '50%' : '100%' }}
            />
          </div>

          <div className="p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
              {step === 'otp' && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-page transition-colors"
                  aria-label="Back to mobile number"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider">
                  Step {step === 'mobile' ? '1' : '2'} of 2
                </p>
                <h2 className="text-base font-bold text-text-primary">
                  {step === 'mobile' ? 'Enter Mobile Number' : 'Verify OTP'}
                </h2>
              </div>
            </div>

            {/* Error banner */}
            {displayError && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error text-xs mb-4"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{displayError}</span>
              </div>
            )}

            {/* ── Step 1: Mobile number ──────────────────────────────────── */}
            {step === 'mobile' && (
              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                <p className="text-xs text-text-secondary">
                  Enter your registered 10-digit mobile number. An OTP will be sent to verify your identity.
                </p>

                <div>
                  <label htmlFor="mobile-input" className="block text-xs font-semibold text-text-primary mb-1.5">
                    Mobile Number <span className="text-status-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                      +91
                    </span>
                    <input
                      id="mobile-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        setLocalError(null);
                        setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                      }}
                      placeholder="9876543210"
                      required
                      autoFocus
                      className="w-full pl-12 pr-4 py-2.5 text-sm rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={isSending || mobile.length !== 10}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Sending OTP…
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>

                {/* Demo credentials panel */}
                <div className="p-3 bg-surface-page rounded-xl border border-surface-border text-xs text-text-secondary space-y-1.5">
                  <p className="font-bold text-brand-dark text-[11px] uppercase tracking-wider">Demo Accounts</p>
                  <div className="grid grid-cols-1 gap-1">
                    <DemoCredentialRow icon="🌾" label="Farmer" mobile="9876543210" onFill={setMobile} />
                    <DemoCredentialRow icon="🏢" label="Officer" mobile="9999999999" onFill={setMobile} />
                    <DemoCredentialRow icon="🛡️" label="Admin" mobile="8888888888" onFill={setMobile} />
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 opacity-70">
                    OTP for all accounts: <code className="font-bold text-brand-primary">123456</code>
                  </p>
                </div>
              </form>
            )}

            {/* ── Step 2: OTP verification ───────────────────────────────── */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                <p className="text-xs text-text-secondary">
                  OTP sent to{' '}
                  <span className="font-bold text-text-primary">+91 {mobile}</span>.{' '}
                  Enter the 6-digit code below.
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-primary text-center">
                    Enter OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={(v) => { setOtp(v); setLocalError(null); }}
                    disabled={isVerifying}
                  />
                </div>

                {/* Resend timer */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-text-secondary">
                      Resend OTP in{' '}
                      <span className="font-bold text-brand-primary">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSending}
                      className="text-xs font-semibold text-brand-primary hover:underline disabled:opacity-50"
                    >
                      {isSending ? 'Resending…' : 'Resend OTP'}
                    </button>
                  )}
                </div>

                <button
                  id="verify-otp-btn"
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Verifying…
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <p className="text-center text-xs text-text-secondary">
                  Demo OTP:{' '}
                  <button
                    type="button"
                    onClick={() => setOtp('123456')}
                    className="font-bold text-brand-primary hover:underline"
                  >
                    Fill 123456
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Register link ──────────────────────────────────────────────── */}
        <p className="text-center text-xs text-text-secondary">
          New farmer?{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:underline">
            Register here
          </Link>
        </p>

        {/* ── Ministry footer ────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 text-xs text-text-secondary text-center">
          <ShieldCheck className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          <span>Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
        </div>
      </div>
    </div>
  );
};

// ─── Helper sub-component ─────────────────────────────────────────────────────

const DemoCredentialRow: React.FC<{
  icon: string;
  label: string;
  mobile: string;
  onFill: (m: string) => void;
}> = ({ icon, label, mobile, onFill }) => (
  <button
    type="button"
    onClick={() => onFill(mobile)}
    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-light transition-colors text-left w-full group"
    aria-label={`Fill ${label} demo mobile ${mobile}`}
  >
    <span>{icon}</span>
    <span className="font-medium text-text-primary">{label}:</span>
    <code className="font-bold text-brand-primary group-hover:underline">{mobile}</code>
  </button>
);
