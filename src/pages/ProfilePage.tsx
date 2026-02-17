import {useEffect, useState, useRef, ChangeEvent} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {Camera, Loader2, User as UserIcon, Mail, Calendar, ExternalLink, Phone} from 'lucide-react';
import {AccountBadge} from '@/components/common/AccountBadge';
import {ProfileLayout} from '@/components/layout/ProfileLayout';

export default function ProfilePage() {
    const {user, isLoading: authLoading, refreshUser} = useAuth();
    const [profileName, setProfileName] = useState('');
    const [profileAvatar, setProfileAvatar] = useState('');
    const [profileDirty, setProfileDirty] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const profileInitialized = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        } else if (user && !profileInitialized.current) {
            setProfileName(user.profile.name);
            setProfileAvatar(user.profile.avatar || '');
            profileInitialized.current = true;
        }
    }, [user, authLoading, navigate]);

    const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const avatarUrl = await api.uploadAvatar(file);
            setProfileAvatar(avatarUrl);
            await refreshUser();
            toast.success('Фото профиля обновлено');
        } catch (error: any) {
            toast.error(error.message || 'Не удалось загрузить фото');
        } finally {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleSaveProfile = async () => {
        if (!profileName.trim()) {
            toast.error('Имя не может быть пустым');
            return;
        }

        setIsSavingProfile(true);
        try {
            await api.updateProfile({
                profile: {name: profileName.trim()},
            });
            setProfileDirty(false);
            await refreshUser();
            toast.success('Профиль обновлён');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Не удалось обновить профиль');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!authLoading && !user) {
        return null;
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="p-6 animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-32 rounded-full bg-gray-200"/>
                            <div className="flex-1 space-y-3 pt-1">
                                <div className="h-8 bg-gray-200 rounded w-48"/>
                                <div className="h-4 bg-gray-200 rounded w-32"/>
                                <div className="flex gap-2 pt-1">
                                    <div className="h-6 bg-gray-200 rounded w-20"/>
                                    <div className="h-6 bg-gray-200 rounded w-16"/>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <ProfileLayout
            title="Профиль"
            description="Управляйте настройками своего аккаунта"
        >
            {/* Profile Card */}
            <Card className="p-8 mb-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer ring-4 ring-offset-2 ring-transparent hover:ring-blue-300 transition-all"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    {profileAvatar ? (
                                        <img
                                            src={profileAvatar}
                                            alt={profileName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-5xl text-gray-400 font-semibold">
                                                {profileName[0]?.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    {isUploadingAvatar ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin"/>
                                    ) : (
                                        <Camera className="h-6 w-6 text-white"/>
                                    )}
                                </div>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Нажмите на фото<br/>чтобы изменить
                            </p>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Имя
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={profileName}
                                        maxLength={100}
                                        onChange={(e) => {
                                            setProfileName(e.target.value);
                                            setProfileDirty(true);
                                        }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ваше имя"
                                    />
                                </div>
                            </div>
                            {/* Email / Phone (read-only) */}
                            {user.email && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email связан с {user.provider.toUpperCase()} аккаунтом
                                    </p>
                                </div>
                            )}

                            {user.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Номер телефона
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                        <input
                                            type="phone"
                                            value={user.phone}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Номер телефона связан с {user.provider.toUpperCase()} аккаунтом
                                    </p>
                                </div>
                            )}

                            {/* Account Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Тип аккаунта
                                </label>
                                <div className="flex items-center gap-3">
                                    <AccountBadge accountType={user.accountType}/>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                                        {user.provider.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Created At */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Регистрация
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={new Date(user.createdAt).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            {profileDirty && (
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                    className="w-full md:w-auto"
                                >
                                    {isSavingProfile && <Loader2 className="h-4 w-4 animate-spin mr-2"/>}
                                    Сохранить изменения
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Premium Upsell for Free Users */}
                {user.accountType === 'free' && (
                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">Обновитесь до Premium</h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    Получите неограниченное количество карточек, custom домены, расширенную аналитику и
                                    приоритетную поддержку.
                                </p>
                                <Button
                                    onClick={() => navigate('/premium')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2"/>
                                    Узнать больше о Premium
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
        </ProfileLayout>
    );
}
