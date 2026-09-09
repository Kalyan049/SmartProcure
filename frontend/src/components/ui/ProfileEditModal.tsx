import React, { useState } from 'react';
import { X, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { LanguageCode } from '@shared/types';

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { user, setLanguage } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(user?.language || 'en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await fetchApi(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          language: preferredLang,
        }),
      });

      // Update local auth provider state (this is simplified, ideally 
      // AuthProvider would have an updateProfile function or we trigger a refetch)
      setLanguage(preferredLang);
      
      // Since we don't have a direct setUser in useAuth, we rely on page reload
      // or the next session fetch to get the updated name. For a hackathon, 
      // a reload is acceptable if we really need the UI to update immediately.
      window.location.reload();
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 id="modal-title" className="text-lg font-bold text-text-primary">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-page text-text-secondary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-status-error/10 border border-status-error/20 text-status-error text-xs rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-primary border-2 border-brand-mint">
              <UserIcon className="w-8 h-8" />
            </div>
            <p className="text-xs text-text-secondary">{user.mobile}</p>
          </div>

          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-text-primary mb-1">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="profile-lang" className="block text-xs font-semibold text-text-primary mb-1">
              Preferred Language
            </label>
            <select
              id="profile-lang"
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="te">తెలుగు (TE)</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-surface-border text-sm font-semibold text-text-secondary hover:bg-surface-page transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
