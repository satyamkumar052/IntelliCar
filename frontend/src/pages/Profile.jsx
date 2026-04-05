import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/authSlice';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Lock, Eye, EyeOff, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';

const InputField = ({ icon: Icon, label, disabled, children, hint }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Icon size={13} className={disabled ? 'text-gray-600' : 'text-primary'} />
            {label}
        </label>
        {children}
        {hint && <p className="text-xs text-gray-600 italic">{hint}</p>}
    </div>
);

const MIN_PW_LENGTH = 8;

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const isPasswordTooShort = newPassword.length > 0 && newPassword.length < MIN_PW_LENGTH;
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [currentPwMatch, setCurrentPwMatch] = useState(null); // null | true | false
    const [checkingPw, setCheckingPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    // Debounced current password check
    useEffect(() => {
        if (!currentPassword) {
            setCurrentPwMatch(null);
            return;
        }
        setCheckingPw(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await api.post('/auth/verify-password', { password: currentPassword });
                setCurrentPwMatch(res.data.success === true);
            } catch {
                setCurrentPwMatch(false);
            } finally {
                setCheckingPw(false);
            }
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [currentPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToUpdate = { ...formData };

            if (newPassword) {
                if (newPassword.length < MIN_PW_LENGTH) {
                    toast.error(`Password must be at least ${MIN_PW_LENGTH} characters.`);
                    setLoading(false);
                    return;
                }
                if (!currentPassword) {
                    toast.error('Please enter your current password to set a new one.');
                    setLoading(false);
                    return;
                }
                if (!currentPwMatch) {
                    toast.error('Current password is incorrect.');
                    setLoading(false);
                    return;
                }
                dataToUpdate.password = newPassword;
            }

            const resultAction = await dispatch(updateProfile(dataToUpdate));
            if (updateProfile.fulfilled.match(resultAction)) {
                toast.success('Profile updated successfully!');
                setNewPassword('');
                setCurrentPassword('');
                setCurrentPwMatch(null);
            } else {
                toast.error(resultAction.payload || 'Failed to update profile');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';
    const showCurrentPasswordField = newPassword.length > 0;

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your personal information and security</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                        <ShieldCheck className="text-primary" size={16} />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">Verified Driver</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Sidebar Avatar Card ── */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary/30 select-none">
                                    {avatarLetter}
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-surface-container-high" title="Online" />
                            </div>
                            <div>
                                <h2 className="text-lg font-heading font-bold text-white">{user?.name}</h2>
                                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">{user?.role}</p>
                            </div>
                            <div className="w-full pt-4 border-t border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail size={12} className="text-primary" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                {user?.phone && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Phone size={12} className="text-primary" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tips card */}
                        <div className="glass-card p-4 space-y-2">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Tips</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Keep your profile up to date to ensure seamless access to all IntelliCar features.
                            </p>
                        </div>
                    </div>

                    {/* ── Main Form ── */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Personal Info Section */}
                            <div className="glass-card p-6 space-y-5">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <User size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Personal Information</h3>
                                        <p className="text-xs text-gray-600">Update your name, phone, and address</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <InputField icon={User} label="Full Name">
                                        <input
                                            type="text"
                                            className="input-glow w-full"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </InputField>

                                    <InputField icon={Mail} label="Email Address" disabled hint="Email cannot be changed">
                                        <input
                                            type="email"
                                            className="input-glow w-full opacity-40 cursor-not-allowed"
                                            value={formData.email}
                                            disabled
                                        />
                                    </InputField>

                                    <InputField icon={Phone} label="Phone Number">
                                        <input
                                            type="text"
                                            className="input-glow w-full"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </InputField>

                                    <InputField icon={MapPin} label="Primary Address">
                                        <input
                                            type="text"
                                            className="input-glow w-full"
                                            placeholder="City, State, Zip"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </InputField>
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="glass-card p-6 space-y-5">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <KeyRound size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Update Password</h3>
                                        <p className="text-xs text-gray-600">Leave blank to keep your current password</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* New Password */}
                                    <InputField icon={Lock} label="New Password">
                                        <div className="relative">
                                            <input
                                                type={newPasswordVisible ? 'text' : 'password'}
                                                className={`input-glow w-full pr-10 transition-colors duration-300 ${
                                                    isPasswordTooShort
                                                        ? 'border-red-500/60 focus:border-red-400'
                                                        : newPassword.length >= MIN_PW_LENGTH
                                                        ? 'border-green-500/60 focus:border-green-400'
                                                        : ''
                                                }`}
                                                placeholder={`Min ${MIN_PW_LENGTH} characters`}
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    if (!e.target.value) {
                                                        setCurrentPassword('');
                                                        setCurrentPwMatch(null);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setNewPasswordVisible(v => !v)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {newPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {/* Length bar + hint */}
                                        {newPassword.length > 0 && (
                                            <div className="space-y-1 mt-2">
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${
                                                            newPassword.length < 4
                                                                ? 'bg-red-500'
                                                                : newPassword.length < MIN_PW_LENGTH
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min((newPassword.length / 16) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                {isPasswordTooShort && (
                                                    <p className="text-xs text-red-400">
                                                        ✗ At least {MIN_PW_LENGTH} characters required ({newPassword.length}/{MIN_PW_LENGTH})
                                                    </p>
                                                )}
                                                {!isPasswordTooShort && (
                                                    <p className="text-xs text-green-400">✓ Length OK</p>
                                                )}
                                            </div>
                                        )}
                                    </InputField>

                                    {/* Current Password – appears only when typing new password */}
                                    <div
                                        className="overflow-hidden transition-all duration-500"
                                        style={{
                                            maxHeight: showCurrentPasswordField ? '120px' : '0px',
                                            opacity: showCurrentPasswordField ? 1 : 0,
                                        }}
                                    >
                                        <InputField icon={ShieldCheck} label="Current Password">
                                            <div className="relative">
                                                <input
                                                    type={currentPasswordVisible ? 'text' : 'password'}
                                                    className={`input-glow w-full pr-10 transition-colors duration-300 ${
                                                        currentPwMatch === true
                                                            ? 'border-green-500/60 focus:border-green-400'
                                                            : currentPwMatch === false
                                                            ? 'border-red-500/60 focus:border-red-400'
                                                            : ''
                                                    }`}
                                                    placeholder="Confirm your current password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPasswordVisible(v => !v)}
                                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {currentPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                {/* Status icon */}
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    {checkingPw ? (
                                                        <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                                                    ) : currentPwMatch === true ? (
                                                        <CheckCircle2 size={16} className="text-green-400" />
                                                    ) : currentPwMatch === false ? (
                                                        <XCircle size={16} className="text-red-400" />
                                                    ) : null}
                                                </div>
                                            </div>
                                            {/* Inline feedback */}
                                            {currentPassword && !checkingPw && (
                                                <p className={`text-xs mt-1 ${currentPwMatch ? 'text-green-400' : 'text-red-400'}`}>
                                                    {currentPwMatch ? '✓ Password verified' : '✗ Incorrect password'}
                                                </p>
                                            )}
                                        </InputField>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || isPasswordTooShort || (newPassword && !currentPwMatch)}
                                    className="btn-primary flex items-center gap-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    <Save size={16} />
                                    {loading ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
