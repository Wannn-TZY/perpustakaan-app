// hooks/useProfile.js
import { useState, useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import api from '../app/services/api';
import authService from '../app/services/authService';
import { Alert } from 'react-native';

export const useProfile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [stats, setStats] = useState({ loans: 0, favorites: 0, reviews: 0 });
    const [activeLoan, setActiveLoan] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const [loansRes, favRes, notifRes] = await Promise.all([
                api.get('/loans'),
                api.get('/bookmarks'),
                api.get('/notifications')
            ]);

            const loansData = loansRes.data.data || [];
            const favsData = favRes.data.data || [];
            const notifsData = notifRes.data || [];

            setStats({
                loans: loansData.length,
                favorites: favsData.length,
                reviews: 0
            });

            const active = loansData.find(l => l.status === 'borrowed' || l.status === 'approved' || l.status === 'active');
            setActiveLoan(active);

            const unread = notifsData.filter(n => !n.is_read).length;
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
                Alert.alert('Sukses', 'Foto profil berhasil diperbarui.');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            Alert.alert('Error', 'Gagal mengunggah foto profil.');
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
            Alert.alert('Error', 'Gagal memperbarui profil.');
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
