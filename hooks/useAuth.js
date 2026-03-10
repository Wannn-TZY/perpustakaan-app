// hooks/useAuth.js
import { useState, useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import { useToast } from '../app/context/ToastContext';
import authService from '../app/services/authService';
import { Alert } from 'react-native';

export const useAuth = () => {
    const { showToast } = useToast();
    const { setUser, updateUser, logout: contextLogout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const login = async (email, password) => {
        setError('');
        if (!email.trim()) { setError('Email wajib diisi.'); return false; }
        if (!password) { setError('Password wajib diisi.'); return false; }

        setLoading(true);
        try {
            const res = await authService.login(email, password);
            const { token, user } = res.data;
            await setUser({ ...user, token });
            return true;
        } catch (err) {
            const status = err?.response?.status;
            setError(err?.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        setError('');
        setFieldErrors({});
        setLoading(true);
        try {
            const res = await authService.register(data);
            const { token, user, message } = res.data;

            if (token) {
                await setUser({ ...user, token });
            }

            return { success: true, message: message || 'Registrasi berhasil.' };
        } catch (err) {
            const errors = err?.response?.data?.errors;
            if (errors) {
                const mapped = {};
                Object.keys(errors).forEach((k) => { mapped[k] = errors[k][0]; });
                setFieldErrors(mapped);
            } else {
                setError(err?.response?.data?.message || 'Registrasi gagal.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (data) => {
        setLoading(true);
        try {
            await authService.changePassword(data);
            showToast('Password berhasil diperbarui.', 'success');
            return true;
        } catch (err) {
            showToast(err?.response?.data?.message || 'Gagal mengubah password.', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async () => {
        setLoading(true);
        try {
            await authService.resendOTP();
            showToast('Kode verifikasi baru telah dikirim ke email kamu.', 'success');
            return true;
        } catch (err) {
            showToast(err?.response?.data?.message || 'Gagal mengirim kode.', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (code) => {
        setError('');
        setLoading(true);
        try {
            const res = await authService.verifyOTP(code);
            const { user } = res.data;
            // Update context with the new user state (verified)
            await updateUser(user);
            showToast('Email kamu berhasil diverifikasi!', 'success');
            return true;
        } catch (err) {
            setError(err?.response?.data?.message || 'Verifikasi gagal. Periksa kembali kode kamu.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        setLoading(true);
        try {
            await authService.deleteAccount();
            await contextLogout();
            return true;
        } catch (err) {
            showToast('Gagal menghapus akun.', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setError('');
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            return true;
        } catch (err) {
            setError(err?.response?.data?.message || 'Gagal mengirim token reset.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (data) => {
        setError('');
        setFieldErrors({});
        setLoading(true);
        try {
            await authService.resetPassword(data);
            return true;
        } catch (err) {
            const errors = err?.response?.data?.errors;
            if (errors) {
                const mapped = {};
                Object.keys(errors).forEach((k) => { mapped[k] = errors[k][0]; });
                setFieldErrors(mapped);
            } else {
                setError(err?.response?.data?.message || 'Gagal mereset password.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        changePassword,
        resendVerification,
        deleteAccount,
        forgotPassword,
        resetPassword,
        verifyOTP,
        loading,
        error,
        setError,
        fieldErrors,
        setFieldErrors,
    };
};
