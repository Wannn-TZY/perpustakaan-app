// constants/Config.js
import Constants from 'expo-constants';

// Otomatis mengambil IP dari server lokal saat ini (Metro Bundler Expr)
const getLocalIp = () => {
    try {
        const debuggerHost = Constants?.expoConfig?.hostUri;
        if (debuggerHost) {
            return debuggerHost.split(':')[0];
        }
    } catch (error) {
        // Abaikan error
    }
    // Fallback jika tidak terdeteksi
    return '192.168.1.10';
};

const LOCAL_IP = getLocalIp();

export const BASE_URL = __DEV__
    ? `http://${LOCAL_IP}:8000/api`
    : 'https://api.bacabuku.web.id/api';

export default {
    BASE_URL,
};
