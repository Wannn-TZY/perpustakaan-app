// hooks/useProfile.js
import { useState, useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import { useToast } from '../app/context/ToastContext';
import api from '../app/services/api';
import authService from '../app/services/authService';
import { Alert } from 'react-native';

export const useProfile = () => {
    const { showToast } = useToast();
    const { user, updateUser } = useContext(AuthContext);
    const [stats, setStats] = useState({ loans: 0, favorites: 0, reviews: 0 });
    const [activeLoan, setActiveLoan] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            // Parallel fetching — including /auth/me to refresh verification status
            const [userRes, loansRes, favRes, notifRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/loans'),
                api.get('/bookmarks'),
                api.get('/notifications'),
            ]);

            const userData = userRes.data?.data;
            if (userData) {
                updateUser(userData);
            }

            const loansData = loansRes.data?.data?.data || loansRes.data?.data || [];
            const favsData = favRes.data?.data?.data || favRes.data?.data || [];
            const notifsData = notifRes.data?.data?.data || notifRes.data?.data || [];

            setStats({
                loans: Array.isArray(loansData) ? loansData.length : 0,
                favorites: Array.isArray(favsData) ? favsData.length : 0,
                reviews: 0
            });

            const active = Array.isArray(loansData) ? loansData.find(l => l.status === 'borrowed' || l.status === 'approved' || l.status === 'active') : null;
            setActiveLoan(active);

            const unread = Array.isArray(notifsData) ? notifsData.filter(n => !n.is_read).length : 0;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (uri) => {
        setUploading(true);
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('avatar', { uri, name: filename, type });

            const res = await authService.updateAvatar(formData);

            const newAvatarUrl = res.data.avatar_url || res.data.user?.avatar_url;
            if (newAvatarUrl) {
                await updateUser({ avatar_url: newAvatarUrl });
                showToast('Foto profil berhasil diperbarui.', 'success');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('Gagal mengunggah foto profil.', 'error');
            return false;
        } finally {
            setUploading(false);
        }
    };

    const updateProfileData = async (data) => {
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', data);
            await updateUser(res.data.user || data);
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Gagal memperbarui profil.', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        stats,
        activeLoan,
        unreadCount,
        loading,
        uploading,
        fetchProfileData,
        uploadAvatar,
        updateProfileData,
    };
};
