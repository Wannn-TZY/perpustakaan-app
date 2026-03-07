// services/notificationService.js
import api from './api';

const notificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async () => {
        return api.get('/notifications');
    },

    /**
     * Mark notification as read
     * @param {number|string} id 
     */
    markAsRead: async (id) => {
        return api.post(`/notifications/${id}/read`);
    },

    /**
     * Delete notification
     * @param {number|string} id 
     */
    deleteNotification: async (id) => {
        return api.delete(`/notifications/${id}`);
    },
};

export default notificationService;
