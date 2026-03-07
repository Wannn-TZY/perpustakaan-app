// services/bookService.js
import api from './api';

const bookService = {
    /**
     * Fetch books with filters
     * @param {object} params { q, category_id, is_featured }
     */
    getBooks: async (params = {}) => {
        return api.get('/books', { params });
    },

    /**
     * Get single book detail
     * @param {number|string} id 
     */
    getBookDetail: async (id) => {
        return api.get(`/books/${id}`);
    },

    /**
     * Get book categories
     */
    getCategories: async () => {
        return api.get('/categories');
    },

    /**
     * Get trending/featured books
     */
    getTrending: async () => {
        return api.get('/books', { params: { is_featured: true } });
    },

    /**
     * Toggle bookmark for a book
     * @param {number|string} id 
     */
    toggleBookmark: async (id, isFavorite, bookmarkId) => {
        if (isFavorite) {
            return api.delete(`/bookmarks/${bookmarkId}`);
        } else {
            return api.post(`/books/${id}/bookmark`);
        }
    },

    /**
     * Get bookmarks (favorites)
     */
    getBookmarks: async () => {
        return api.get('/bookmarks');
    },

    /**
     * Get book annotations
     * @param {number|string} id 
     */
    getAnnotations: async (id) => {
        return api.get(`/books/${id}/annotations`);
    },

    /**
     * Add annotation
     * @param {number|string} id 
     * @param {object} data { content, type, location_reference, is_private }
     */
    addAnnotation: async (id, data) => {
        return api.post(`/books/${id}/annotations`, data);
    },

    /**
     * Delete annotation
     * @param {number|string} annoId 
     */
    deleteAnnotation: async (annoId) => {
        return api.delete(`/annotations/${annoId}`);
    },

    /**
     * Download digital file
     * @param {number|string} bookId 
     * @param {number|string} fileId 
     */
    downloadFile: async (bookId, fileId) => {
        return api.get(`/books/${bookId}/files/${fileId}/download`);
    },
};

export default bookService;
