// constants/Config.js
import Constants from 'expo-constants';

// Ganti IP ini dengan IP lokal komputer kamu jika ingin tes di HP asli
const LOCAL_IP = '192.168.1.10'; // Contoh, sesuaikan nanti

export const BASE_URL = __DEV__
    ? `http://${LOCAL_IP}:8000/api`
    : 'https://api.bacabuku.web.id/api';

export default {
    BASE_URL,
};
