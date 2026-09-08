import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/cards/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sprout, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const LoginPage: React.FC = () => {
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile === '9999999999') {
      loginAs('OFFICER');
      navigate('/officer/dashboard');
    } else {
      loginAs('FARMER');
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-md bg-brand-dark flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Sprout className="w-8 h-8 text-brand-mint" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">SmartProcure</h1>
          <p className="text-xs text-text-secondary mt-1">
            Right Information. Less Waiting. Brighter Tomorrows.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6">
          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h2 className="text-base font-bold text-text-primary">Farmer / Officer Login</h2>
              <p className="text-xs text-text-secondary">
                Enter your registered 10-digit mobile number to receive a secure OTP.
              </p>

              <Input
                label="Mobile Number"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                SEND OTP
              </Button>

              <div className="p-3 bg-surface-page rounded-sm border border-surface-border text-xs text-text-secondary">
                <span className="font-bold text-brand-dark">Demo Test Numbers:</span>
                <p className="mt-1">🌾 Farmer Demo: <code className="font-bold">9876543210</code></p>
                <p>🏢 Officer Demo: <code className="font-bold">9999999999</code></p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h2 className="text-base font-bold text-text-primary">Verify OTP</h2>
              <p className="text-xs text-text-secondary">
                OTP sent to <span className="font-bold text-text-primary">{mobile}</span>
              </p>

              <Input
                label="6-Digit OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                VERIFY & CONTINUE
              </Button>

              <button
                type="button"
                onClick={() => setStep('mobile')}
                className="w-full text-center text-xs text-brand-primary font-bold hover:underline"
              >
                Change Mobile Number
              </button>
            </form>
          )}
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-text-secondary text-center">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
      </div>
    </div>
  );
};
