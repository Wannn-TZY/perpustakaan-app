// hooks/useLoans.js
import { useState, useCallback } from 'react';
import loanService from '../app/services/loanService';
import { useToast } from '../app/context/ToastContext';
import { Alert } from 'react-native';

export const useLoans = () => {
    const { showToast } = useToast();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [borrowing, setBorrowing] = useState(false);

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        try {
            const res = await loanService.getLoans();
            // Handle Laravel pagination: extracted array is in data.data
            const loansArray = res.data?.data?.data || res.data?.data || [];
            setLoans(Array.isArray(loansArray) ? loansArray : []);
        } catch (error) {
            console.error('Error fetching loans:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const requestBorrow = async (bookId, type = 'fisik') => {
        setBorrowing(true);
        try {
            await loanService.requestLoan(bookId, type);
            showToast('Permintaan peminjaman berhasil dikirim. Menunggu petugas.', 'success');
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal meminjam buku';
            showToast(msg, 'error');
            return false;
        } finally {
            setBorrowing(false);
        }
    };

    const cancelLoan = async (loanId) => {
        setLoading(true);
        try {
            await loanService.cancelLoan(loanId);
            showToast('Peminjaman berhasil dibatalkan.', 'success');
            await fetchLoans();
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal membatalkan peminjaman', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const requestReturn = async (loanId) => {
        setLoading(true);
        try {
            await loanService.requestReturn(loanId);
            showToast('Permintaan pengembalian berhasil dikirim.', 'success');
            await fetchLoans();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal mengajukan pengembalian';
            showToast(msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loans,
        loading,
        borrowing,
        fetchLoans,
        requestBorrow,
        cancelLoan,
        requestReturn,
    };
};
