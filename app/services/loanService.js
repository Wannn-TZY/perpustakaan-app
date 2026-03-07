// services/loanService.js
import api from './api';

const loanService = {
    /**
     * Get user loans
     */
    getLoans: async () => {
        return api.get('/loans');
    },

    /**
     * Request borrowing a book
     * @param {number|string} bookId 
     */
    requestLoan: async (bookId) => {
        return api.post(`/books/${bookId}/loan`);
    },

    /**
     * Get specific loan detail
     * @param {number|string} id 
     */
    getLoanDetail: async (id) => {
        return api.get(`/loans/${id}`);
    },
};

export default loanService;
