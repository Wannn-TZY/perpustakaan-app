// services/authService.js
import api from './api';

const authService = {
    /**
     * Login user
     */
    login: async (email, password) => {
        return api.post('/auth/login', {
            email: email.trim().toLowerCase(),
            password,
        });
    },

    /**
     * Register user
     */
    register: async (data) => {
        return api.post('/auth/register', data);
    },

    /**
     * Logout user
     */
    logout: async () => {
        return api.post('/auth/logout');
    },

    /**
     * Update Profile Avatar
     */
    updateAvatar: async (formData) => {
        return api.post('/auth/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Change user password
     */
    changePassword: async (data) => {
        return api.post('/auth/change-password', data);
    },

    /**
     * Verify OTP Code
     */
    verifyOTP: async (code) => {
        return api.post('/auth/verify-otp', { code: code.trim() });
    },

    /**
     * Resend OTP Code
     */
    resendOTP: async () => {
        return api.post('/auth/resend-otp');
    },

    /**
     * Delete user account
     */
    deleteAccount: async () => {
        return api.delete('/auth/delete-account');
    },

    /**
     * Forgot Password - Request Token
     */
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email });
    },

    /**
     * Reset Password - Submit Token & New Password
     */
    resetPassword: async (data) => {
        return api.post('/auth/reset-password', data);
    },
};

export default authService;
