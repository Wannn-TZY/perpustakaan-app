// constants/Config.js
import Constants from 'expo-constants';

// Ganti IP ini dengan IP lokal komputer kamu jika ingin tes di HP asli
const LOCAL_IP = '172.18.1.250'; // IP Laptop saat ini

export const BASE_URL = __DEV__
    ? `http://${LOCAL_IP}:8000/api`
    : 'https://api.bacabuku.web.id/api';

export default {
    BASE_URL,
};
