import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useBookDetail } from '../../hooks/useBookDetail';
import { useLoans } from '../../hooks/useLoans';
import { View, Text, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal';

export default function BookDetailScreen({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { id } = route.params;
  const {
    book,
    loading,
    isFavorite,
    annotations,
    currentLoan,
    loadingRead,
    fetchDetail,
    toggleFavorite,
    addNote,
    deleteNote,
    readDigital
  } = useBookDetail(id);

  const { borrowing, requestBorrow, requestReturn, loading: returnLoading } = useLoans();
  const [newNote, setNewNote] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Auto refresh setiap kali screen di-focus
  useEffect(() => {
    if (isFocused) {
      fetchDetail();
    }
  }, [isFocused]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const success = await addNote(newNote);
    if (success) setNewNote('');
  };

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loadingWrapper}>
        <Text>Buku tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <View style={styles.header}><Text style={styles.coverEmoji}>📘</Text></View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{book.title}</Text>
          {book.is_featured && <View style={styles.trendBadge}><Text style={styles.trendText}>🔥 Trending</Text></View>}
        </View>
        <Text style={styles.author}>{book.authors?.map(a => a.name).join(', ') || 'Penulis Anonim'} • {book.categories?.[0]?.name || 'Umum'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>⭐ {book.rating || '4.5'}</Text><Text style={styles.statLabel}>Rating</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>📄 {book.pages || '200'}</Text><Text style={styles.statLabel}>Halaman</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>👀 {book.view_count || '0'}</Text><Text style={styles.statLabel}>Dilihat</Text></View>
        </View>
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{book.description || 'Tidak ada deskripsi untuk buku ini.'}</Text>
        <View style={styles.extraInfo}>
          <Text style={styles.extraText}>🆔 ISBN: {book.isbn}</Text>
          <Text style={styles.extraText}>🏢 Penerbit: {book.publisher || '-'}</Text>
          <Text style={styles.extraText}>📚 Stok: {book.total_copies > 0 ? 'Tersedia' : 'Habis'}</Text>
        </View>
        <View style={styles.annotationSection}>
          <Text style={styles.sectionTitle}>Catatan Saya</Text>
          <View style={styles.noteInputRow}>
            <TextInput style={styles.noteInput} placeholder="Tambah catatan pribadi..." value={newNote} onChangeText={setNewNote} multiline />
            <TouchableOpacity style={[styles.addNoteBtn, !newNote.trim() && { opacity: 0.5 }]} onPress={handleAddNote} disabled={!newNote.trim()}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          {annotations.map(item => (
            <View key={item.annotations_id} style={styles.noteCard}>
              <Text style={styles.noteContent}>{item.content}</Text>
              <View style={styles.noteFooter}>
                <Text style={styles.noteDate}>{new Date(item.created_at).toLocaleDateString('id-ID')}</Text>
                <TouchableOpacity onPress={() => deleteNote(item.annotations_id)}><Ionicons name="trash-outline" size={14} color="#94a3af" /></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.buttonRow}>
          {currentLoan ? (
            <TouchableOpacity
              activeOpacity={currentLoan.status === 'active' && book.files?.length > 0 ? 0.7 : 1}
              onPress={() => {
                if (currentLoan.status === 'active' && book.files?.length > 0) {
                  readDigital(navigation);
                }
              }}
              style={[
                styles.statusBanner,
                currentLoan.status === 'pending' && styles.pendingBanner,
                currentLoan.status === 'active' && styles.activeBanner,
                currentLoan.status === 'returning' && styles.returningBanner,
                (currentLoan.status === 'active' && book.files?.length > 0) && styles.activeReadBanner
              ]}
            >
              <Ionicons
                name={
                  currentLoan.status === 'pending' ? 'time-outline'
                    : currentLoan.status === 'returning' ? 'swap-horizontal-outline'
                      : 'book-outline'
                }
                size={22}
                color={
                  currentLoan.status === 'pending' ? '#b45309'
                    : currentLoan.status === 'returning' ? '#7c3aed'
                      : '#ffffff'
                }
              />
              <View style={styles.statusTextContainer}>
                <Text style={[
                  styles.statusTitle,
                  currentLoan.status === 'pending' && { color: '#b45309' },
                  currentLoan.status === 'returning' && { color: '#7c3aed' },
                  currentLoan.status === 'active' && { color: '#ffffff' },
                ]}>
                  {currentLoan.status === 'pending' ? 'Menunggu Persetujuan'
                    : currentLoan.status === 'returning' ? 'Menunggu Konfirmasi Pengembalian'
                      : 'Buku Siap Dibaca'}
                </Text>
                <Text style={[
                  styles.statusSub,
                  currentLoan.status === 'active' && { color: 'rgba(255,255,255,0.8)' },
                  currentLoan.status === 'returning' && { color: '#8b5cf6' },
                ]}>
                  {currentLoan.status === 'pending'
                    ? 'Permintaan pinjaman kamu sedang diproses staff.'
                    : currentLoan.status === 'returning'
                      ? 'Pengembalian sedang menunggu konfirmasi dari petugas.'
                      : 'Klik di sini untuk mulai membaca buku.'}
                </Text>
              </View>
              {currentLoan.status === 'active' && book.files?.length > 0 && (
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.borrowBtn, (borrowing || book.total_copies === 0) && { opacity: 0.6 }]}
              onPress={async () => {
                const success = await requestBorrow(id);
                if (success) fetchDetail();
              }}
              disabled={borrowing || book.total_copies === 0}
            >
              <Text style={styles.borrowText}>
                {borrowing ? 'Memproses...' : (book.total_copies > 0 ? '📖 Pinjam Buku' : '❌ Stok Habis')}
              </Text>
            </TouchableOpacity>
          )}

          {!currentLoan && book.files && book.files.length > 0 && (
            <TouchableOpacity style={styles.readBtn} onPress={() => readDigital(navigation)} disabled={loadingRead}>
              <Text style={styles.readText}>{loadingRead ? '...' : '📱 Baca'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.favoriteBtn, isFavorite && { backgroundColor: '#ffe4e6' }]} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#e94560" : "#64748b"} />
          </TouchableOpacity>
        </View>

        {currentLoan && (currentLoan.status === 'active' || currentLoan.status === 'overdue') && (
          <TouchableOpacity
            style={styles.returnRequestBtn}
            onPress={() => setShowReturnModal(true)}
          >
            <Ionicons name="arrow-undo-outline" size={18} color="#6366f1" />
            <Text style={styles.returnRequestText}>Ajukan Pengembalian</Text>
          </TouchableOpacity>
        )}

        <ConfirmModal
          visible={showReturnModal}
          icon="arrow-undo-outline"
          iconColor="#6366f1"
          title="Kembalikan Buku?"
          message={`Apakah kamu yakin ingin mengajukan pengembalian buku "${book.title}"? Staff akan mengkonfirmasi pengembalianmu.`}
          confirmText="Ya, Kembalikan"
          cancelText="Batal"
          confirmColor="#6366f1"
          loading={returnLoading}
          onCancel={() => setShowReturnModal(false)}
          onConfirm={async () => {
            const success = await requestReturn(currentLoan?.loans_id);
            setShowReturnModal(false);
            if (success) fetchDetail();
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { height: 240, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  coverEmoji: { fontSize: 96 },
  content: { backgroundColor: '#ffffff', marginTop: -32, marginHorizontal: 16, borderRadius: 24, padding: 20, elevation: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 },
  trendBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  trendText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626' },
  author: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#f8fafc', paddingVertical: 14, marginHorizontal: 4, borderRadius: 14, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  description: { fontSize: 14, color: '#475569', lineHeight: 22 },
  extraInfo: { marginTop: 16, gap: 4 },
  extraText: { fontSize: 13, color: '#64748b' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  borrowBtn: { flex: 1, backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  borrowText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  favoriteBtn: { width: 54, backgroundColor: '#fee2e2', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  readBtn: { width: 80, backgroundColor: '#e0e7ff', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  readText: { color: '#6366f1', fontWeight: 'bold', fontSize: 15 },
  annotationSection: { marginTop: 24 },
  noteInputRow: { flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'center' },
  noteInput: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1e293b', maxHeight: 80 },
  addNoteBtn: { backgroundColor: '#6366f1', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  noteCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#6366f1' },
  noteContent: { fontSize: 13, color: '#334155', lineHeight: 18 },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  noteDate: { fontSize: 11, color: '#94a3af' },

  // Loan Status
  statusBanner: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, gap: 12, borderWidth: 1 },
  pendingBanner: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  activeBanner: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  returningBanner: { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' },
  activeReadBanner: { backgroundColor: '#6366f1', borderColor: '#4f46e5' },
  statusTextContainer: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: 'bold' },
  statusSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  infoBox: { flexDirection: 'row', backgroundColor: '#eef2ff', padding: 12, borderRadius: 12, marginTop: 16, gap: 8, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 12, color: '#4338ca', lineHeight: 18 },
  returnRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ff',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff'
  },
  returnRequestText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14
  }
});
