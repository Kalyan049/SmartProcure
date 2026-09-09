/**
 * RegisterPage — Module 5: Authentication & Role-Based Access
 *
 * 4-step farmer self-registration flow:
 *   Step 1: Mobile number → Send OTP
 *   Step 2: OTP verification (simulated — use 123456)
 *   Step 3: Farmer profile details (name, language, land, crops)
 *           Aadhaar verification is SIMULATED in MVP
 *   Step 4: Success screen with generated Farmer ID
 *
 * A Progress Stepper tracks the user's position through all four steps.
 */
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  User,
  Smartphone,
  Leaf,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import type { LanguageCode } from '@shared/types';
import type { FarmerRegistrationData } from '@/services/auth/authService';

// ─── Progress Stepper ─────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Mobile', icon: Smartphone },
  { label: 'Verify', icon: ShieldCheck },
  { label: 'Profile', icon: User },
  { label: 'Done', icon: CheckCircle2 },
];

const ProgressStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center w-full mb-6" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={currentStep}>
    {STEPS.map((step, idx) => {
      const stepNum = idx + 1;
      const isDone = stepNum < currentStep;
      const isActive = stepNum === currentStep;
      const Icon = step.icon;

      return (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                isDone
                  ? 'bg-brand-primary text-white'
                  : isActive
                    ? 'bg-brand-dark text-white ring-2 ring-brand-primary ring-offset-2'
                    : 'bg-surface-border text-text-secondary',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <Icon className="w-4 h-4" aria-hidden="true" />}
            </div>
            <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-brand-dark' : 'text-text-secondary'}`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 transition-all ${isDone ? 'bg-brand-primary' : 'bg-surface-border'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── OTP Input (shared with LoginPage) ───────────────────────────────────────

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
    onChange(newDigits.join('').trim());
    if (clean && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputs.current[idx] = el; }}
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
            digit ? 'border-brand-primary bg-brand-light' : 'border-surface-border',
            'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
            'disabled:opacity-40',
          ].join(' ')}
        />
      ))}
    </div>
  );
};

// ─── Field components ─────────────────────────────────────────────────────────

const FieldLabel: React.FC<{ htmlFor: string; label: string; required?: boolean }> = ({
  htmlFor, label, required,
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-text-primary mb-1.5">
    {label} {required && <span className="text-status-error">*</span>}
  </label>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { id: string }> = (props) => (
  <input
    {...props}
    className={[
      'w-full px-3 py-2.5 text-sm rounded-lg border border-surface-border bg-white',
      'text-text-primary placeholder:text-text-secondary',
      'focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
      'disabled:opacity-40 transition-all',
      props.className || '',
    ].join(' ')}
  />
);

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; options: { value: string; label: string }[] }> = ({
  id, options, ...props
}) => (
  <select
    id={id}
    {...props}
    className="w-full px-3 py-2.5 text-sm rounded-lg border border-surface-border bg-white text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

// ─── RegisterPage ─────────────────────────────────────────────────────────────

const CROPS = [
  { value: 'Wheat', label: 'Wheat (Gehun)' },
  { value: 'Paddy', label: 'Paddy (Dhan)' },
  { value: 'Mustard', label: 'Mustard (Sarson)' },
  { value: 'Gram', label: 'Gram (Chana)' },
  { value: 'Maize', label: 'Maize (Makka)' },
  { value: 'Soybean', label: 'Soybean' },
];

const LANGUAGES: { value: LanguageCode; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
];

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
  'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export const RegisterPage: React.FC = () => {
  const { sendOtp, registerFarmer, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [generatedFarmerId, setGeneratedFarmerId] = useState('');

  // Form state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState<Omit<FarmerRegistrationData, 'mobile'>>({
    fullName: '',
    preferredLanguage: 'en',
    landSizeAcres: 0,
    landVillage: '',
    landDistrict: '',
    landState: 'Uttar Pradesh',
    primaryCrop: 'Wheat',
    allCropsGrown: ['Wheat'],
    aadhaarLast4: '',
  });

  const displayError = localError || authError;

  const setField = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setLocalError(null);
  };

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!/^\d{10}$/.test(mobile.trim())) {
      setLocalError('Enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOtp(mobile.trim());
      if (result.success) {
        setStep(2);
      } else {
        setLocalError(result.error || 'Failed to send OTP.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (otp.length !== 6) {
      setLocalError('Enter the complete 6-digit OTP.');
      return;
    }
    if (otp !== '123456') {
      setLocalError('Invalid OTP. For demo, use: 123456');
      return;
    }

    // Simulated OTP passes — advance to profile step
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setStep(3);
  };

  // ── Step 3: Submit farmer profile ───────────────────────────────────────────

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!form.fullName.trim()) {
      setLocalError('Full name is required.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerFarmer({ ...form, mobile: mobile.trim() });
      if (result.success && result.farmerIdCode) {
        setGeneratedFarmerId(result.farmerIdCode);
        setStep(4);
      } else {
        setLocalError(result.error || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mx-auto shadow-sm mb-3">
            <Sprout className="w-7 h-7 text-brand-mint" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-extrabold text-brand-dark tracking-tight">
            Farmer Registration
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Ministry of Consumer Affairs, Food &amp; Public Distribution
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-surface-border">
            <div
              className="h-full bg-brand-primary transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="p-6">
            <ProgressStepper currentStep={step} />

            {/* Error banner */}
            {displayError && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error text-xs mb-4"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* ── Step 1: Mobile ─────────────────────────────────────────── */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                <div>
                  <h2 className="text-sm font-bold text-text-primary mb-1">Enter Mobile Number</h2>
                  <p className="text-xs text-text-secondary">
                    Your mobile number will be your login ID for SmartProcure.
                  </p>
                </div>

                <div>
                  <FieldLabel htmlFor="reg-mobile" label="Mobile Number" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">+91</span>
                    <TextInput
                      id="reg-mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="pl-12"
                      value={mobile}
                      onChange={(e) => {
                        setLocalError(null);
                        setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                      }}
                      placeholder="10-digit mobile number"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || mobile.length !== 10}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : 'Send OTP'}
                </button>
              </form>
            )}

            {/* ── Step 2: OTP ─────────────────────────────────────────────── */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                <div>
                  <h2 className="text-sm font-bold text-text-primary mb-1">Verify OTP</h2>
                  <p className="text-xs text-text-secondary">
                    OTP sent to <span className="font-bold text-text-primary">+91 {mobile}</span>.
                  </p>
                </div>

                <OtpInput
                  value={otp}
                  onChange={(v) => { setOtp(v); setLocalError(null); }}
                  disabled={isLoading}
                />

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

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</> : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="w-3 h-3" /> Change mobile number
                </button>
              </form>
            )}

            {/* ── Step 3: Farmer Profile ──────────────────────────────────── */}
            {step === 3 && (
              <form onSubmit={handleSubmitProfile} className="space-y-4" noValidate>
                <div>
                  <h2 className="text-sm font-bold text-text-primary mb-0.5">Farmer Details</h2>
                  <p className="text-xs text-text-secondary">
                    Tell us about yourself and your farm.
                    <span className="ml-1 text-[10px] bg-status-info/10 text-status-info px-1.5 py-0.5 rounded-full">
                      Aadhaar verification simulated for MVP
                    </span>
                  </p>
                </div>

                {/* Personal */}
                <div className="p-3 rounded-xl bg-surface-page border border-surface-border space-y-3">
                  <p className="text-[11px] font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Personal Information
                  </p>

                  <div>
                    <FieldLabel htmlFor="reg-name" label="Full Name" required />
                    <TextInput
                      id="reg-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      autoFocus
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="reg-lang" label="Preferred Language" required />
                    <SelectInput
                      id="reg-lang"
                      value={form.preferredLanguage}
                      onChange={(e) => setField('preferredLanguage', e.target.value as LanguageCode)}
                      options={LANGUAGES}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="reg-aadhaar" label="Aadhaar Last 4 Digits (optional)" />
                    <TextInput
                      id="reg-aadhaar"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.aadhaarLast4 || ''}
                      onChange={(e) => setField('aadhaarLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="XXXX"
                    />
                    <p className="text-[10px] text-text-secondary mt-1">
                      Verification is simulated for MVP — no real UIDAI call is made.
                    </p>
                  </div>
                </div>

                {/* Land Details */}
                <div className="p-3 rounded-xl bg-surface-page border border-surface-border space-y-3">
                  <p className="text-[11px] font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Land Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel htmlFor="reg-acres" label="Land Size (Acres)" />
                      <TextInput
                        id="reg-acres"
                        type="number"
                        min={0}
                        step={0.1}
                        value={form.landSizeAcres || ''}
                        onChange={(e) => setField('landSizeAcres', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 4.5"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="reg-village" label="Village / Town" />
                      <TextInput
                        id="reg-village"
                        type="text"
                        value={form.landVillage}
                        onChange={(e) => setField('landVillage', e.target.value)}
                        placeholder="e.g. Rampur"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel htmlFor="reg-district" label="District" />
                      <TextInput
                        id="reg-district"
                        type="text"
                        value={form.landDistrict}
                        onChange={(e) => setField('landDistrict', e.target.value)}
                        placeholder="e.g. Varanasi"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="reg-state" label="State" required />
                      <SelectInput
                        id="reg-state"
                        value={form.landState}
                        onChange={(e) => setField('landState', e.target.value)}
                        options={STATES.map((s) => ({ value: s, label: s }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Crop Information */}
                <div className="p-3 rounded-xl bg-surface-page border border-surface-border space-y-3">
                  <p className="text-[11px] font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Crop Information
                  </p>

                  <div>
                    <FieldLabel htmlFor="reg-crop" label="Primary Crop" required />
                    <SelectInput
                      id="reg-crop"
                      value={form.primaryCrop}
                      onChange={(e) => {
                        const val = e.target.value;
                        setField('primaryCrop', val);
                        setField('allCropsGrown', [val, ...form.allCropsGrown.filter((c) => c !== val)]);
                      }}
                      options={CROPS}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="reg-crops-multi" label="All Crops Grown" />
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {CROPS.map((c) => {
                        const selected = form.allCropsGrown.includes(c.value);
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              const next = selected
                                ? form.allCropsGrown.filter((x) => x !== c.value)
                                : [...form.allCropsGrown, c.value];
                              setField('allCropsGrown', next.length ? next : [form.primaryCrop]);
                            }}
                            className={[
                              'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                              selected
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white text-text-secondary border-surface-border hover:border-brand-primary',
                            ].join(' ')}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Creating Account…</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" />Complete Registration</>
                  )}
                </button>
              </form>
            )}

            {/* ── Step 4: Success ─────────────────────────────────────────── */}
            {step === 4 && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-status-success" aria-hidden="true" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-brand-dark">Registration Successful!</h2>
                  <p className="text-xs text-text-secondary mt-1">
                    Welcome to SmartProcure. Your Farmer ID has been generated.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-light border border-brand-mint text-center">
                  <p className="text-xs text-text-secondary mb-1">Your Farmer ID</p>
                  <p className="text-2xl font-extrabold text-brand-dark tracking-widest">
                    {generatedFarmerId}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Note this down for your records.
                  </p>
                </div>

                <div className="text-xs text-text-secondary p-3 rounded-lg bg-surface-page border border-surface-border text-left space-y-1">
                  <p>✅ Mobile number verified</p>
                  <p>✅ Farmer profile created</p>
                  <p>✅ Aadhaar verification simulated (MVP)</p>
                  <p>✅ You can now login and book procurement slots</p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Already registered */}
        {step < 4 && (
          <p className="text-center text-xs text-text-secondary">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Sign In with OTP
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
