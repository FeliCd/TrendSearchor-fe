import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2, Edit2, Check, X, Calendar, User, Mail, Phone, Briefcase, MapPin, Camera } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';
import UserAvatar from '@/components/ui/UserAvatar';

function InlineField({ label, icon: Icon, name, value, type = 'text', options = [], onSave, placeholder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (name === 'fullName' && editValue.trim().length < 3) { setError('Must be at least 3 characters'); return; }
    if (name === 'mail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editValue)) { setError('Invalid email'); return; }
    if (name === 'phone' && editValue && !/^0\d{9}$/.test(editValue)) { setError('Must be 10 digits starting with 0'); return; }

    try {
      setSaving(true);
      setError('');
      await onSave(name, editValue);
      setIsEditing(false);
    } catch (err) {
      const data = err?.response?.data;
      let msg = '';
      if (typeof data === 'string') {
        msg = data;
      } else if (data?.message) {
        msg = data.message;
      } else if (data) {
        msg = Object.values(data)[0] || 'Failed to update field';
      } else {
        msg = 'Failed to update field';
      }
      setError(msg);
    } 
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    setError('');
  };

  let displayValue = value;
  if (type === 'select') {
    const opt = options.find((o) => o.value === value);
    if (opt) displayValue = opt.label;
  }
  if (!displayValue) displayValue = <span className="text-[#c6c6cd] italic">Not provided</span>;

  return (
    <div className="group relative p-4 rounded-xl bg-[#f8f9ff] border border-[#c6c6cd]/40 hover:border-[#0058be]/30 transition-all shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-[#0058be]" />}
        <label className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider">{label}</label>
      </div>
      
      {isEditing ? (
        <div className="space-y-2 mt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {type === 'select' ? (
                <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full px-3 py-1.5 bg-white border border-[#0058be] rounded-lg text-[#0b1c30] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]/40 appearance-none">
                  <option value="">Select...</option>
                  {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              ) : (
                <input type={type} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={placeholder} className="w-full px-3 py-1.5 bg-white border border-[#0058be] rounded-lg text-[#0b1c30] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]/40" />
              )}
            </div>
            <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={handleCancel} disabled={saving} className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0b1c30] truncate pr-4">{displayValue}</p>
          <button type="button" onClick={() => setIsEditing(true)} className="absolute top-3 right-3 p-1.5 rounded-lg text-[#76777d] opacity-0 group-hover:opacity-100 hover:bg-[#e1e4f3] hover:text-[#0058be] transition-all bg-white shadow-sm border border-[#c6c6cd]/40">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProfileForm({ initialProfile, onSuccess, onToast }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: initialProfile?.fullName || '',
    mail: initialProfile?.mail || '',
    dob: initialProfile?.dob || '',
    phone: initialProfile?.phone || '',
    gender: initialProfile?.gender || '',
    workplace: initialProfile?.workplace || '',
  });

  const handleSaveField = async (name, value) => {
    try {
      const updatedData = { ...profile, [name]: value };
      const updatedProfile = await profileService.updateProfile(updatedData);
      setProfile(updatedProfile);
      onSuccess();
      onToast(`${name} updated successfully`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data;
      onToast(typeof msg === 'string' ? msg : Object.values(msg || {})[0] || 'Failed to update field', 'error');
      throw err; // throw to be caught by InlineField
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onToast('Image must be less than 5MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      // Optimistic update
      const objectUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatarUrl: objectUrl }));

      const formData = new FormData();
      formData.append('file', file);
      
      const updatedProfile = await profileService.uploadAvatar(formData);
      setProfile((prev) => ({ ...prev, avatarUrl: updatedProfile.data?.avatarUrl || updatedProfile.avatarUrl }));
      onSuccess();
      onToast('Avatar updated successfully');
    } catch (err) {
      onToast('Failed to upload avatar. Backend endpoint might not be ready.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const displayName = profile.fullName || user?.mail || '?';

  return (
    <div className="h-full flex flex-col">
      {/* Banner Area */}
      <div className="-mx-6 -mt-6 h-32 bg-gradient-to-r from-[#0b1c30] via-[#102a43] to-[#0058be] rounded-t-2xl"></div>
      
      {/* Avatar & Name Area */}
      <div className="flex items-start gap-5 -mt-16 mb-8 relative z-10">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative w-32 h-32 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
        >
          <UserAvatar user={user} profile={profile} size="full" />
          
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Update</span>
              </>
            )}
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          hidden 
        />
        
        <div className="pt-[76px] flex items-baseline gap-3">
          <p className="text-[#0b1c30] font-semibold text-3xl tracking-tight leading-none">{displayName}</p>
          <span className={`text-lg font-medium opacity-70 ${ROLE_COLORS[user?.role]?.text || 'text-[#76777d]'}`}>
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </div>
      </div>
      
      {/* Fields Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 pb-2">
        <InlineField icon={User} label="Full Name" name="fullName" value={profile.fullName} onSave={handleSaveField} />
        <InlineField icon={Mail} label="Email Address" name="mail" type="email" value={profile.mail} onSave={handleSaveField} />
        <InlineField icon={Phone} label="Phone Number" name="phone" type="tel" placeholder="0912345678" value={profile.phone} onSave={handleSaveField} />
        <InlineField icon={Briefcase} label="Workplace" name="workplace" value={profile.workplace} onSave={handleSaveField} />
        <InlineField icon={Calendar} label="Date of Birth" name="dob" type="date" value={profile.dob} onSave={handleSaveField} />
        <InlineField 
          icon={User}
          label="Gender" 
          name="gender" 
          type="select" 
          value={profile.gender} 
          options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHERS', label: 'Other' }]} 
          onSave={handleSaveField} 
        />
      </div>
    </div>
  );
}
