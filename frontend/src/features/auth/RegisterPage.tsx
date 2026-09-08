import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, CheckCircle2 } from 'lucide-react';
import { Button, Input, Select, Card } from '@/components';
import { useAuth } from '@/app/providers/AuthProvider';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [crop, setCrop] = useState('wheat');
  const [stateName, setStateName] = useState('Punjab');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !fullName) return;
    loginAs('FARMER', fullName);
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-sm bg-brand-primary flex items-center justify-center text-white shadow-sm mx-auto mb-3">
          <Sprout className="w-7 h-7 text-brand-mint" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
          Register for SmartProcure
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Ministry of Consumer Affairs, Food & Public Distribution
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-6 sm:p-8 bg-white shadow-card">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              isRequired
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
            />

            <Input
              label="Mobile Number (Aadhaar linked)"
              isRequired
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />

            <Select
              label="Primary Produce Crop"
              isRequired
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              options={[
                { value: 'wheat', label: 'Wheat (Gehun)' },
                { value: 'paddy', label: 'Paddy (Dhan)' },
                { value: 'mustard', label: 'Mustard (Sarson)' },
                { value: 'gram', label: 'Gram (Chana)' },
              ]}
            />

            <Select
              label="State / Union Territory"
              isRequired
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              options={[
                { value: 'Punjab', label: 'Punjab' },
                { value: 'Haryana', label: 'Haryana' },
                { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
                { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
              ]}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isFullWidth
              className="mt-2"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-secondary border-t border-surface-border pt-4">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Sign In with OTP
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
