// hooks/useNotifications.js
import { useState, useCallback } from 'react';
import notificationService from '../app/services/notificationService';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await notificationService.getNotifications();
            setNotifications(res.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.notifications_id === id ? { ...n, is_read: true } : n)
            );
            return true;
        } catch (error) {
            return false;
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.notifications_id !== id));
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        deleteNotification,
    };
};
