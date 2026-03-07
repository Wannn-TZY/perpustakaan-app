// hooks/useBookDetail.js
import { useState, useCallback } from 'react';
import bookService from '../app/services/bookService';
import { Alert, Linking } from 'react-native';

export const useBookDetail = (id) => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [loadingRead, setLoadingRead] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        try {
            const [detailRes, favRes, annoRes] = await Promise.all([
                bookService.getBookDetail(id),
                bookService.getBookmarks(),
                bookService.getAnnotations(id)
            ]);

            setBook(detailRes.data);
            setAnnotations(annoRes.data || []);

            if (favRes.data && favRes.data.data) {
                const found = favRes.data.data.find(b => b.books_id === parseInt(id));
                if (found) {
                    setIsFavorite(true);
                    setBookmarkId(found.bookmarks_id);
                } else {
                    setIsFavorite(false);
                    setBookmarkId(null);
                }
            }
        } catch (error) {
            console.error('Error fetching book detail:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const res = await bookService.toggleBookmark(id, isFavorite, bookmarkId);
            if (isFavorite) {
                setIsFavorite(false);
                setBookmarkId(null);
            } else {
                setIsFavorite(true);
                setBookmarkId(res.data.data?.bookmarks_id || res.data.bookmarks_id);
            }
            return true;
        } catch (error) {
            Alert.alert('Error', 'Gagal memperbarui favorit');
            return false;
        }
    };

    const addNote = async (content) => {
        try {
            const res = await bookService.addAnnotation(id, {
                content,
                type: 'note',
                location_reference: 'General',
                is_private: true
            });
            setAnnotations(prev => [res.data.data, ...prev]);
            return true;
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan catatan');
            return false;
        }
    };

    const deleteNote = async (annoId) => {
        try {
            await bookService.deleteAnnotation(annoId);
            setAnnotations(prev => prev.filter(a => a.annotations_id !== annoId));
            return true;
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus catatan');
            return false;
        }
    };

    const readDigital = async () => {
        if (!book?.files || book.files.length === 0) {
            Alert.alert('Info', 'Buku ini belum memiliki versi digital.');
            return;
        }

        setLoadingRead(true);
        try {
            const file = book.files[0];
            const res = await bookService.downloadFile(id, file.book_files_id);
            if (res.data.url) {
                await Linking.openURL(res.data.url);
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal membuka file buku digital.');
        } finally {
            setLoadingRead(false);
        }
    };

    return {
        book,
        loading,
        isFavorite,
        annotations,
        loadingRead,
        fetchDetail,
        toggleFavorite,
        addNote,
        deleteNote,
        readDigital,
    };
};
