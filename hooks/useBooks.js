// hooks/useBooks.js
import { useState, useCallback } from 'react';
import bookService from '../app/services/bookService';

export const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTrending = async () => {
        try {
            const res = await bookService.getTrending();
            if (res.data && res.data.data) {
                setTrendingBooks(res.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching trending books:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await bookService.getCategories();
            if (res.data && res.data.data) {
                const formatted = [
                    { id: 'All', label: 'Semua', icon: '✦' },
                    ...res.data.data.map(c => ({
                        id: c.categories_id,
                        label: c.name,
                        icon: '◈'
                    }))
                ];
                setCategories(formatted);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBooks = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await bookService.getBooks(params);
            setBooks(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const onRefresh = async (params = {}) => {
        setRefreshing(true);
        await fetchBooks(params);
        setRefreshing(false);
    };

    return {
        books,
        trendingBooks,
        categories,
        loading,
        refreshing,
        fetchBooks,
        fetchTrending,
        fetchCategories,
        onRefresh,
    };
};
