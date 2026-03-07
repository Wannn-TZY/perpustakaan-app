import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLoans } from '../../hooks/useLoans';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const statusColors = {
    pending: '#f5a623',
    approved: '#52b788',
    borrowed: '#6c63ff',
    returned: '#94a3b8',
    rejected: '#dc2626',
    overdue: '#ef4444',
};

const statusLabels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    borrowed: 'Dipinjam',
    returned: 'Dikembalikan',
    rejected: 'Ditolak',
    overdue: 'Terlambat',
};

export default function MyLoansScreen() {
    const navigation = useNavigation();
    const { loans, loading, refreshing, fetchLoans, cancelLoan, onRefresh } = useLoans();

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleCancel = (loanId) => {
        Alert.alert(
            'Batalkan Pesanan',
            'Apakah Anda yakin ingin membatalkan permintaan peminjaman ini?',
            [
                { text: 'Tidak', style: 'cancel' },
                { text: 'Ya, Batalkan', onPress: () => cancelLoan(loanId) }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const book = item.book;
        if (!book) return null;
        const status = item.status.toLowerCase();
        const color = statusColors[status] || '#94a3b8';
        const isPending = status === 'pending';

        return (
            <View style={styles.loanCardContainer}>
                <TouchableOpacity style={styles.loanCard} activeOpacity={0.8} onPress={() => navigation.navigate('BookDetail', { id: book.books_id })}>
                    <View style={styles.bookInfo}>
                        <View style={[styles.statusBadge, { backgroundColor: color + '15', borderColor: color }]}>
                            <View style={[styles.statusDot, { backgroundColor: color }]} />
                            <Text style={[styles.statusText, { color }]}>{statusLabels[status] || status}</Text>
                        </View>
                        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                        <Text style={styles.loanDate}>Diajukan: {new Date(item.loan_date).toLocaleDateString('id-ID')}</Text>
                        {item.return_date && <Text style={styles.returnDate}>Kembali: {new Date(item.return_date).toLocaleDateString('id-ID')}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                </TouchableOpacity>
                {isPending && (
                    <TouchableOpacity style={styles.cancelActionBtn} onPress={() => handleCancel(item.loans_id)}>
                        <Ionicons name="close-circle-outline" size={16} color={RED} />
                        <Text style={styles.cancelActionText}>Batalkan Pesanan</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={CREAM} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={NAVY} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Pinjaman Saya</Text>
                <View style={{ width: 40 }} />
            </View>
            {loading && loans.length === 0 ? (
                <View style={styles.loading}><ActivityIndicator size="large" color={RED} /></View>
            ) : (
                <FlatList
                    data={loans}
                    keyExtractor={(item) => item.loans_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={() => (
                        <View style={styles.empty}>
                            <View style={styles.emptyIcon}><Ionicons name="library-outline" size={48} color="#94a3b8" /></View>
                            <Text style={styles.emptyTitle}>Belum Ada Pinjaman</Text>
                            <Text style={styles.emptySub}>Kamu belum meminjam buku apapun saat ini.</Text>
                            <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Home')}><Text style={styles.exploreText}>Cari Buku</Text></TouchableOpacity>
                        </View>
                    )}
                    refreshControl={<RefreshControl refreshing={!!refreshing} onRefresh={fetchLoans} colors={[RED]} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: CREAM },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: NAVY, fontFamily: 'Georgia' },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16 },
    loanCardContainer: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, overflow: 'hidden' },
    loanCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    cancelActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: '#fff5f6', gap: 6 },
    cancelActionText: { fontSize: 12, fontWeight: '700', color: RED },
    bookInfo: { flex: 1 },
    statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, marginBottom: 8 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    bookTitle: { fontSize: 16, fontWeight: '700', color: NAVY, marginBottom: 4 },
    loanDate: { fontSize: 12, color: '#64748b' },
    returnDate: { fontSize: 12, color: '#ef4444', marginTop: 2, fontWeight: '600' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 8 },
    emptySub: { fontSize: 14, color: '#94a3b8', textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
    exploreBtn: { backgroundColor: NAVY, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
    exploreText: { color: '#fff', fontWeight: '700' },
});
