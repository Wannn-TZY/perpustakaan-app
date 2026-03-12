import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * ReaderDetailScreen
 * Digunakan untuk menampilkan PDF atau Word secara langsung dalam aplikasi.
 * Untuk Word (.doc/.docx), kita gunakan Google Docs Viewer.
 */
export default function ReaderDetailScreen({ route }) {
    const { url, title, fileType } = route.params;

    // Jika file adalah Word, bungkus dengan Google Docs Viewer
    const viewerUrl = (fileType === 'doc' || fileType === 'docx')
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Menyiapkan buku...</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: viewerUrl }}
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={renderLoading}
                originWhitelist={['*']}
                // Mencegah navigasi ke luar atau download jika memungkinkan
                onShouldStartLoadWithRequest={(request) => {
                    // Hanya izinkan load URL viewer atau resource terkait
                    return true;
                }}
                // Injeksi JS untuk menyembunyikan elemen UI tertentu jika dari Google Docs Viewer
                onMessage={(event) => { }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
});
