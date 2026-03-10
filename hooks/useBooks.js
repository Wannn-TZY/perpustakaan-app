// hooks/useBooks.js
import { useState, useCallback, useRef } from 'react';
import bookService from '../app/services/bookService';

export const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Request tracking to prevent race conditions
    const abortControllerRef = useRef(null);

    const fetchTrending = async () => {
        try {
            const res = await bookService.getTrending();
            // Laravel paginated response: res.data.data.data is the array
            const data = res.data?.data?.data || res.data?.data || [];
            if (Array.isArray(data)) {
                setTrendingBooks(data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching trending books:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await bookService.getCategories();
            const data = res.data?.data || [];
            if (Array.isArray(data)) {
                setCategories(formatCategories(data));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const formatCategories = (data) => {
        return [
            { id: 'All', label: 'Semua', icon: '✦' },
            ...data.map(c => ({
                id: c.categories_id,
                label: c.name,
                icon: '◈'
            }))
        ];
    };

    const fetchDiscovery = async (params = {}) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        try {
            const res = await bookService.getDiscovery(params, { signal });
            const { trending, categories, books_page } = res.data;

            if (trending) setTrendingBooks(trending.slice(0, 5));
            if (categories) setCategories(formatCategories(categories));
            if (books_page) {
                const booksArray = books_page.data || books_page || [];
                setBooks(Array.isArray(booksArray) ? booksArray : []);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.message !== 'canceled') {
                console.error('Error fetching discovery data:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = useCallback(async (params = {}) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        try {
            const res = await bookService.getBooks(params, { signal });
            // Handle Laravel pagination: extracted array is in data.data
            const booksArray = res.data?.data?.data || res.data?.data || [];
            setBooks(Array.isArray(booksArray) ? booksArray : []);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.message !== 'canceled') {
                console.error('Error fetching books:', error);
                setBooks([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const res = await bookService.getBookmarks();
            setBooks(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const onRefresh = async (params = {}) => {
        setRefreshing(true);
        if (params.favorites) {
            await fetchFavorites();
        } else {
            await fetchBooks(params);
        }
        setRefreshing(false);
    };

    return {
        books,
        trendingBooks,
        categories,
        loading,
        refreshing,
        fetchBooks,
        fetchFavorites,
        fetchTrending,
        fetchCategories,
        fetchDiscovery,
        onRefresh,
    };
};
