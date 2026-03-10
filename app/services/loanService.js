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
     * @param {string} type 'digital' or 'fisik'
     */
    requestLoan: async (bookId, type = 'fisik') => {
        return api.post(`/books/${bookId}/loan`, {
            loan_type: type
        });
    },

    /**
     * Cancel a loan request
     * @param {number|string} loanId 
     */
    cancelLoan: async (loanId) => {
        return api.post(`/loans/${loanId}/cancel`);
    },

    /**
     * Request returning a book
     * @param {number|string} loanId 
     */
    requestReturn: async (loanId) => {
        return api.post(`/loans/${loanId}/return-request`);
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
