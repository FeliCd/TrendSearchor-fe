import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Edit2, Check, X, Calendar, User, Mail, Phone, Camera } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { ROLE_LABELS } from '@/constants/roles';
import { isValidEmail, isValidPhone } from '@/utils/validationUtils';
import UserAvatar from '@/components/ui/UserAvatar';
import SelectDropdown from '@/components/ui/SelectDropdown';

function InlineField({ label, icon: Icon, name, value, type = 'text', options = [], onSave, placeholder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (name === 'fullName' && editValue.trim().length < 3) { setError('Must be at least 3 characters'); return; }
    if (name === 'mail' && !isValidEmail(editValue)) { setError('Invalid email'); return; }
    if (name === 'phone' && editValue && !isValidPhone(editValue)) { setError('Must be 10 digits starting with 09, 03, 05, 07, or 08'); return; }

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
  if (!displayValue) displayValue = <span className="text-gray-600 italic">Not provided</span>;

  return (
    <div className="group relative px-4 py-3 border-2 border-gray-800 hover:border-gray-700 transition-all min-h-[76px] flex flex-col justify-center bg-[#1e1e1e]">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-[#0058be]" />}
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      </div>

      <div className="min-h-[32px] flex items-center w-full relative">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              {type === 'select' ? (
                <div className="w-full">
                  <SelectDropdown
                    value={editValue}
                    onChange={(val) => setEditValue(val)}
                    options={options}
                    placeholder="Select..."
                    size="sm"
                  />
                </div>
              ) : (
                <input type={type} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border-2 border-[#0058be] text-white text-sm focus:outline-none bg-[#1e1e1e]" />
              )}
            </div>
            <button onClick={handleSave} disabled={saving} className="p-2.5 border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex-shrink-0">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={handleCancel} disabled={saving} className="p-2.5 border-2 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
            {error && <p className="absolute -bottom-4 left-0 text-[10px] text-red-500 whitespace-nowrap">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-semibold text-white truncate pr-8">{displayValue}</p>
            <button type="button" onClick={() => setIsEditing(true)} className="absolute top-1/2 -translate-y-1/2 right-0 p-2 border-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-[#252525] hover:text-white transition-all border-gray-800 bg-[#151515]">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileForm({ initialProfile = {}, onSuccess, onToast }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const profileData = initialProfile || {};
  const [profile, setProfile] = useState({
    fullName: profileData.fullName || '',
    mail: profileData.mail || '',
    dob: profileData.dob || '',
    phone: profileData.phone || '',
    gender: profileData.gender || '',
    workplace: profileData.workplace || '',
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
      throw err;
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
      <div className="-mx-6 -mt-6 h-32 border-b-2 border-gray-800 bg-[#1e1e1e]"></div>

      {/* Avatar & Name Area */}
      <div className="flex items-start gap-6 -mt-16 mb-8 relative z-10 pl-2 sm:p4">
        <div className="relative">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-32 h-32 rounded-none border-2 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer bg-[#1e1e1e] border-gray-800 hover:border-[#0058be] transition-colors"
          >
            <UserAvatar user={user} profile={profile} size="full" shape="square" />

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

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#0058be] border-2 border-gray-800 text-white text-[10px] font-black uppercase tracking-widest shadow-sm whitespace-nowrap z-20">
            {ROLE_LABELS[user?.role] || user?.role || 'Admin'}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          hidden
        />

        <div className="pt-[76px] flex items-baseline">
          <p className="text-white font-bold text-[28px] sm:text-3xl tracking-tight leading-none">{displayName}</p>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 pb-2">
        <InlineField icon={User} label="Full Name" name="fullName" value={profile.fullName} onSave={handleSaveField} />
        <InlineField icon={Mail} label="Email Address" name="mail" type="email" value={profile.mail} onSave={handleSaveField} />
        <InlineField icon={Phone} label="Phone Number" name="phone" type="tel" placeholder="0912345678" value={profile.phone} onSave={handleSaveField} />
        <InlineField icon={User} label="Workplace" name="workplace" value={profile.workplace} onSave={handleSaveField} />
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
