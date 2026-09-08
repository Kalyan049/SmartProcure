import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title="Farmer Identity & Land Registry Profile"
      subtitle="Verified farmer identity, land records, and direct benefit transfer bank account details."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              Personal & Verification Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user?.name || 'Ramesh Kumar'} />
              <Input label="Registered Mobile" defaultValue={user?.mobile || '9876543210'} disabled />
              <Input label="Farmer ID Code" defaultValue="SP-FARMER-1082" disabled />
              <Input label="Aadhaar Number (eKYC)" defaultValue="XXXXXXXX3421" disabled />
            </div>

            <div className="mt-4 p-3 bg-brand-tint border border-brand-mint rounded-sm flex items-center gap-2 text-xs text-brand-dark font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
              <span>Aadhaar eKYC Verified successfully via UIDAI gateway.</span>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
              Land & Crop Holding
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Land Size" defaultValue={4.5} unitSuffix="Acres" />
              <Input label="Village" defaultValue="Rampur" />
              <Input label="District" defaultValue="Varanasi" />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
              DBT Bank Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Bank Name" defaultValue="State Bank of India" disabled />
              <Input label="IFSC Code" defaultValue="SBIN0001234" disabled />
              <Input label="Account Number" defaultValue="XXXXXX5892" disabled />
            </div>

            <Button variant="primary" className="mt-6">
              SAVE PROFILE UPDATES
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-tint text-brand-primary border-2 border-brand-mint flex items-center justify-center text-2xl font-bold mb-3">
              R
            </div>
            <h3 className="text-lg font-bold text-text-primary">Ramesh Kumar</h3>
            <p className="text-xs text-text-secondary">Farmer ID: SP-FARMER-1082</p>
            <div className="mt-4 flex justify-center">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-tint text-brand-primary border border-brand-mint flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
