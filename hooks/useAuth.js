// hooks/useAuth.js
import { useState, useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import authService from '../app/services/authService';
import { Alert } from 'react-native';

export const useAuth = () => {
    const { setUser, logout: contextLogout } = useContext(AuthContext);
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
            const { token, user } = res.data;
            await setUser({ ...user, token });
            return true;
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
            Alert.alert('Sukses', 'Password berhasil diperbarui.');
            return true;
        } catch (err) {
            Alert.alert('Gagal', err?.response?.data?.message || 'Gagal mengubah password.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async () => {
        setLoading(true);
        try {
            await authService.resendVerificationEmail();
            Alert.alert('Sukses', 'Email verifikasi telah dikirim ulang.');
            return true;
        } catch (err) {
            Alert.alert('Gagal', err?.response?.data?.message || 'Gagal mengirim email.');
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
            Alert.alert('Gagal', 'Gagal menghapus akun.');
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
        loading,
        error,
        setError,
        fieldErrors,
        setFieldErrors,
    };
};
