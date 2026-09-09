import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ShieldCheck, User, MapPin, Loader2, Save, Calendar, Wheat, Banknote, History } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';

interface FarmerProfile {
  id: string;
  farmer_id_code: string;
  is_aadhaar_verified: boolean;
  aadhaar_masked: string;
  land_size_acres: number;
  land_village: string;
  land_district: string;
  land_state: string;
  bank_account_number_masked: string;
  bank_ifsc: string;
  bank_name: string;
  crops_grown: string[];
  expected_quantity?: number;
  harvest_date?: string;
}

export const FarmerProfilePage: React.FC = () => {
  const { user, language } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    land_size_acres: 0,
    land_village: '',
    land_district: '',
    land_state: '',
    crops_grown: '', // comma separated string for UI
    expected_quantity: 0,
    harvest_date: '',
  });

  // History State
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'procurements' | 'payments'>('profile');
  const [history, setHistory] = useState({
    bookings: [] as any[],
    procurements: [] as any[],
    payments: [] as any[],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings' && history.bookings.length === 0) loadHistory('bookings', API_ENDPOINTS.FARMERS.HISTORY_BOOKINGS);
    if (activeTab === 'procurements' && history.procurements.length === 0) loadHistory('procurements', API_ENDPOINTS.FARMERS.HISTORY_PROCUREMENT);
    if (activeTab === 'payments' && history.payments.length === 0) loadHistory('payments', API_ENDPOINTS.FARMERS.HISTORY_PAYMENTS);
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<{ data: FarmerProfile }>(API_ENDPOINTS.FARMERS.PROFILE);
      setProfile(res.data);
      setFormData({
        land_size_acres: res.data.land_size_acres,
        land_village: res.data.land_village || '',
        land_district: res.data.land_district || '',
        land_state: res.data.land_state || '',
        crops_grown: res.data.crops_grown ? res.data.crops_grown.join(', ') : '',
        expected_quantity: res.data.expected_quantity || 0,
        harvest_date: res.data.harvest_date || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async (type: 'bookings' | 'procurements' | 'payments', endpoint: string) => {
    try {
      const res = await fetchApi<{ data: any[] }>(endpoint);
      setHistory(prev => ({ ...prev, [type]: res.data }));
    } catch (err: any) {
      console.error(`Failed to load ${type} history`, err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg(null);
      
      const payload = {
        ...formData,
        land_size_acres: parseFloat(formData.land_size_acres.toString()),
        expected_quantity: parseFloat(formData.expected_quantity.toString()),
        crops_grown: formData.crops_grown.split(',').map(c => c.trim()).filter(c => c),
      };

      const res = await fetchApi<{ data: FarmerProfile }>(API_ENDPOINTS.FARMERS.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setProfile(res.data);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Farmer Profile" subtitle="Loading profile...">
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      </PageContainer>
    );
  }

  if (error && !profile) {
    return (
      <PageContainer title="Farmer Profile" subtitle="Error">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
          <Button variant="secondary" onClick={loadProfile} className="mt-4">Retry</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Farmer Profile"
      subtitle="Manage your identity, farm details, and track your history."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form and Tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto bg-white border border-surface-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-semibold rounded-md flex justify-center items-center gap-2 transition-colors ${activeTab === 'profile' ? 'bg-brand-tint text-brand-primary' : 'text-text-secondary hover:bg-gray-50'}`}
            >
              <User className="w-4 h-4" /> Farm Details
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-semibold rounded-md flex justify-center items-center gap-2 transition-colors ${activeTab === 'bookings' ? 'bg-brand-tint text-brand-primary' : 'text-text-secondary hover:bg-gray-50'}`}
            >
              <Calendar className="w-4 h-4" /> Bookings
            </button>
            <button
              onClick={() => setActiveTab('procurements')}
              className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-semibold rounded-md flex justify-center items-center gap-2 transition-colors ${activeTab === 'procurements' ? 'bg-brand-tint text-brand-primary' : 'text-text-secondary hover:bg-gray-50'}`}
            >
              <Wheat className="w-4 h-4" /> Procurements
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-semibold rounded-md flex justify-center items-center gap-2 transition-colors ${activeTab === 'payments' ? 'bg-brand-tint text-brand-primary' : 'text-text-secondary hover:bg-gray-50'}`}
            >
              <Banknote className="w-4 h-4" /> Payments
            </button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}
          {successMsg && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{successMsg}</div>}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-primary" />
                  Personal & Verification Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.name || ''} disabled />
                  <Input label="Registered Mobile" defaultValue={user?.mobile || ''} disabled />
                  <Input label="Farmer ID Code" defaultValue={profile?.farmer_id_code || ''} disabled />
                  <Input label="Aadhaar Number (eKYC)" defaultValue={profile?.aadhaar_masked || ''} disabled />
                </div>
                {profile?.is_aadhaar_verified && (
                  <div className="mt-4 p-3 bg-brand-tint border border-brand-mint rounded-sm flex items-center gap-2 text-xs text-brand-dark font-semibold">
                    <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>Aadhaar eKYC Verified successfully via UIDAI gateway.</span>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                  Farm & Crop Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="land_size_acres" label="Land Size" type="number" value={formData.land_size_acres} onChange={handleInputChange} unitSuffix="Acres" />
                  <Input name="land_village" label="Village" value={formData.land_village} onChange={handleInputChange} />
                  <Input name="land_district" label="District" value={formData.land_district} onChange={handleInputChange} />
                  <Input name="land_state" label="State" value={formData.land_state} onChange={handleInputChange} />
                  <Input name="crops_grown" label="Crops Grown (comma separated)" value={formData.crops_grown} onChange={handleInputChange} />
                  <Input name="expected_quantity" label="Expected Quantity" type="number" value={formData.expected_quantity} onChange={handleInputChange} unitSuffix="Quintals" />
                  <Input name="harvest_date" label="Harvest Date" type="date" value={formData.harvest_date} onChange={handleInputChange} />
                </div>
                <Button variant="primary" className="mt-6 w-full md:w-auto" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <><Save className="w-4 h-4 inline mr-2" />SAVE FARM DETAILS</>}
                </Button>
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
             <Card className="p-6">
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">Booking History</h2>
                {history.bookings.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary"><History className="w-8 h-8 mx-auto mb-2 opacity-50" />No bookings found.</div>
                ) : (
                  <div className="space-y-4">
                    {history.bookings.map(item => (
                      <div key={item.id} className="p-4 border border-surface-border rounded-lg flex justify-between items-center bg-gray-50">
                        <div>
                          <p className="font-semibold text-text-primary">{item.center}</p>
                          <p className="text-xs text-text-secondary">Date: {item.date} | Qty: {item.quantity} Qtl</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-brand-tint text-brand-primary rounded-full">{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
             </Card>
          )}

          {/* Procurements Tab */}
          {activeTab === 'procurements' && (
             <Card className="p-6">
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">Procurement History</h2>
                {history.procurements.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary"><History className="w-8 h-8 mx-auto mb-2 opacity-50" />No procurements found.</div>
                ) : (
                  <div className="space-y-4">
                    {history.procurements.map(item => (
                      <div key={item.id} className="p-4 border border-surface-border rounded-lg flex justify-between items-center bg-gray-50">
                        <div>
                          <p className="font-semibold text-text-primary">{item.crop} (Grade {item.grade})</p>
                          <p className="text-xs text-text-secondary">Date: {item.date} | Accepted: {item.accepted_quantity} Qtl</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-brand-tint text-brand-primary rounded-full">{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
             </Card>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
             <Card className="p-6">
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">Payment History</h2>
                {history.payments.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary"><History className="w-8 h-8 mx-auto mb-2 opacity-50" />No payments found.</div>
                ) : (
                  <div className="space-y-4">
                    {history.payments.map(item => (
                      <div key={item.id} className="p-4 border border-surface-border rounded-lg flex justify-between items-center bg-gray-50">
                        <div>
                          <p className="font-semibold text-text-primary">₹{item.amount.toLocaleString()}</p>
                          <p className="text-xs text-text-secondary">Date: {item.date} | Ref: {item.ref}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
             </Card>
          )}

        </div>

        {/* Right Column: Mini Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-tint text-brand-primary border-2 border-brand-mint flex items-center justify-center text-2xl font-bold mb-3 uppercase">
              {user?.name?.charAt(0) || 'F'}
            </div>
            <h3 className="text-lg font-bold text-text-primary">{user?.name}</h3>
            <p className="text-xs text-text-secondary">Farmer ID: {profile?.farmer_id_code}</p>
            <div className="mt-4 flex justify-center">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-tint text-brand-primary border border-brand-mint flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
              </span>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
              DBT Bank Account Details
            </h2>
            <div className="space-y-4">
              <Input label="Bank Name" defaultValue={profile?.bank_name || ''} disabled />
              <Input label="IFSC Code" defaultValue={profile?.bank_ifsc || ''} disabled />
              <Input label="Account Number" defaultValue={profile?.bank_account_number_masked || ''} disabled />
            </div>
            <p className="mt-4 text-[10px] text-text-secondary text-center">Bank details are fetched automatically from UIDAI and cannot be edited directly.</p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
