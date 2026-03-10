// hooks/useBookDetail.js
import { useState, useCallback } from 'react';
import api from '../app/services/api';
import { useToast } from '../app/context/ToastContext';
import bookService from '../app/services/bookService';
import { Alert } from 'react-native';

export const useBookDetail = (id) => {
    const { showToast } = useToast();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [loadingRead, setLoadingRead] = useState(false);
    const [currentLoan, setCurrentLoan] = useState(null);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/books/${id}`);
            const data = res.data;

            setBook(data.data || null);
            setCurrentLoan(data.current_loan || null);
            setIsFavorite(data.is_favorite || false);
            setAnnotations(data.annotations || []);
        } catch (error) {
            console.error('Error fetching book detail:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const currentFav = isFavorite;
            setIsFavorite(!currentFav); // Optimistic update
            await bookService.toggleBookmark(id, currentFav);
            await fetchDetail(); // Re-sync
        } catch (error) {
            console.error('Toggle favorite error:', error);
            setIsFavorite(isFavorite);
            showToast('Gagal memperbarui favorit', 'error');
        }
    };

    const addNote = async (content) => {
        try {
            await bookService.addAnnotation(id, {
                content,
                type: 'note',
                location_reference: 'page-0',
                is_private: true
            });
            await fetchDetail();
            return true;
        } catch (error) {
            showToast('Gagal menambah catatan', 'error');
            return false;
        }
    };

    const deleteNote = async (annoId) => {
        try {
            await bookService.deleteAnnotation(annoId);
            await fetchDetail();
            return true;
        } catch (error) {
            showToast('Gagal menghapus catatan', 'error');
            return false;
        }
    };

    const readDigital = () => {
        if (!book?.files || book.files.length === 0) {
            showToast('Buku ini tidak memiliki salinan digital.', 'info');
            return;
        }
        showToast(`Membuka file: ${book.files[0].file_name}`, 'info');
    };

    return {
        book,
        loading,
        isFavorite,
        annotations,
        currentLoan,
        loadingRead,
        fetchDetail,
        toggleFavorite,
        addNote,
        deleteNote,
        readDigital
    };
};
