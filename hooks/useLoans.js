// hooks/useLoans.js
import { useState, useCallback } from 'react';
import loanService from '../app/services/loanService';
import { useToast } from '../app/context/ToastContext';
import api from '../app/services/api';
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

   const requestBorrow = async (bookId, loanType = 'digital') => {
        if (borrowing) return null; // ✅ Cegah double-tap
 
        setBorrowing(true);
        try {
            const res = await api.post(`/books/${bookId}/loan`, {
                loan_type: loanType
            });
            return { success: true, data: res.data };
        } catch (err) {
            const status  = err?.response?.status;
            const message = err?.response?.data?.userMessage  // ← dari interceptor 429
                         ?? err?.response?.data?.message
                         ?? 'Gagal memproses peminjaman.';
 
            if (status === 429) {
                return {
                    success: false,
                    code: 429,
                    message: 'Terlalu banyak percobaan. Tunggu beberapa saat sebelum mencoba lagi.',
                };
            }
 
            if (status === 422) {
                return {
                    success: false,
                    code: 422,
                    message: message, // pesan validasi dari Laravel
                };
            }
 
            return { success: false, code: status, message };
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
        if (!loanId) return { success: false, message: 'ID peminjaman tidak valid.' };
 
        setLoading(true);
        try {
            const res = await api.post(`/loans/${loanId}/return-request`);
            return { success: true, data: res.data };
        } catch (err) {
            const message = err?.response?.data?.userMessage
                         ?? err?.response?.data?.message
                         ?? 'Gagal mengajukan pengembalian.';
            return { success: false, message };
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
