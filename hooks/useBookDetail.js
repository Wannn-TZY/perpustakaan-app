// hooks/useBookDetail.js
import { useState, useCallback } from 'react';
import api from '../app/services/api';
import { useToast } from '../app/context/ToastContext';
import bookService from '../app/services/bookService';

export const useBookDetail = (id) => {
    const { showToast } = useToast();
    const [book, setBook]               = useState(null);
    const [loading, setLoading]         = useState(false);
    const [isFavorite, setIsFavorite]   = useState(false);
    // ✅ Simpan bookmarkId agar bisa dipakai saat DELETE
    const [bookmarkId, setBookmarkId]   = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [loadingRead, setLoadingRead] = useState(false);
    const [currentLoan, setCurrentLoan] = useState(null);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res  = await api.get(`/books/${id}`);
            const data = res.data;

            setBook(data.data || null);
            setCurrentLoan(data.current_loan  || null);
            setAnnotations(data.annotations   || []);

            // ✅ Backend mengembalikan is_favorite (boolean) dan bookmark_id (nullable int)
            //    Pastikan backend kamu include kedua field ini di response GET /books/{id}
            setIsFavorite(data.is_favorite   || false);
            setBookmarkId(data.bookmark_id   ?? null); // null kalau belum difavoritkan
        } catch (error) {
            console.error('Error fetching book detail:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // ─── Toggle Favorite ────────────────────────────────────────────
    const toggleFavorite = async () => {
        const wasAlreadyFavorite = isFavorite;

        // Optimistic update
        setIsFavorite(!wasAlreadyFavorite);

        try {
            if (wasAlreadyFavorite) {
                // ✅ Hapus: kirim bookmarkId yang tersimpan dari fetchDetail
                if (!bookmarkId) {
                    // Kalau entah kenapa bookmarkId null, refetch dulu untuk sync
                    await fetchDetail();
                    showToast('Coba lagi untuk menghapus favorit', 'info');
                    return;
                }
                await bookService.toggleBookmark(id, true, bookmarkId);
                setBookmarkId(null);
                showToast('Dihapus dari favorit', 'success');
            } else {
                // ✅ Tambah: API POST /books/{id}/bookmark → response berisi bookmark baru
                const res = await bookService.toggleBookmark(id, false, null);
                // Ambil bookmarkId dari response supaya DELETE berikutnya langsung bisa pakai
                const newBookmarkId =
                    res.data?.data?.bookmarks_id ??
                    res.data?.bookmarks_id       ??
                    null;
                setBookmarkId(newBookmarkId);
                showToast('Ditambahkan ke favorit ❤️', 'success');
            }
        } catch (error) {
            // Rollback optimistic update
            setIsFavorite(wasAlreadyFavorite);
            console.error('Toggle favorite error:', error);
            showToast('Gagal memperbarui favorit', 'error');
        }
    };

    // ─── Annotations ────────────────────────────────────────────────
    const addNote = async (content) => {
        try {
            await bookService.addAnnotation(id, {
                content,
                type: 'note',
                location_reference: 'page-0',
                is_private: true,
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

    // ─── Read Digital ────────────────────────────────────────────────
    const readDigital = async (navigation) => {
        if (!book?.files || book.files.length === 0) {
            showToast('Buku ini tidak memiliki salinan digital.', 'info');
            return;
        }

        setLoadingRead(true);
        try {
            const file = book.files[0];
            const res  = await bookService.getViewUrl(id, file.book_files_id);

            if (res.data.success) {
                navigation.navigate('ReaderDetail', {
                    url:      res.data.url,
                    title:    book.title,
                    fileType: file.file_type,
                });
            } else {
                showToast(res.data.message || 'Gagal menyiapkan reader', 'error');
            }
        } catch (error) {
            console.error('Read digital error:', error);
            showToast('Gagal memuat file buku', 'error');
        } finally {
            setLoadingRead(false);
        }
    };

    return {
        book,
        loading,
        isFavorite,
        bookmarkId,
        annotations,
        currentLoan,
        loadingRead,
        fetchDetail,
        toggleFavorite,
        addNote,
        deleteNote,
        readDigital,
    };
};