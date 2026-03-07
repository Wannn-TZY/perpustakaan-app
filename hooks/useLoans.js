// hooks/useLoans.js
import { useState, useCallback } from 'react';
import loanService from '../app/services/loanService';
import { Alert } from 'react-native';

export const useLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [borrowing, setBorrowing] = useState(false);

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        try {
            const res = await loanService.getLoans();
            setLoans(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching loans:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const requestBorrow = async (bookId) => {
        setBorrowing(true);
        try {
            const res = await loanService.requestLoan(bookId);
            Alert.alert('Sukses', 'Permintaan peminjaman berhasil dikirim. Menunggu persetujuan petugas.');
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal meminjam buku';
            Alert.alert('Gagal', msg);
            return false;
        } finally {
            setBorrowing(false);
        }
    };

    return {
        loans,
        loading,
        borrowing,
        fetchLoans,
        requestBorrow,
    };
};
