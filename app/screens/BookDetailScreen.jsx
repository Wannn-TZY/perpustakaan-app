import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useBookDetail } from '../../hooks/useBookDetail';
import { useLoans } from '../../hooks/useLoans';
import { View, Text, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export default function BookDetailScreen({ route }) {
  const { id } = route.params;
  const {
    book,
    loading,
    isFavorite,
    annotations,
    loadingRead,
    fetchDetail,
    toggleFavorite,
    addNote,
    deleteNote,
    readDigital
  } = useBookDetail(id);

  const { borrowing, requestBorrow } = useLoans();
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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
          <TouchableOpacity style={[styles.borrowBtn, (borrowing || book.total_copies === 0) && { opacity: 0.6 }]} onPress={() => requestBorrow(id)} disabled={borrowing || book.total_copies === 0}>
            <Text style={styles.borrowText}>{borrowing ? 'Memproses...' : (book.total_copies > 0 ? '📖 Pinjam' : '❌ Habis')}</Text>
          </TouchableOpacity>
          {book.files && book.files.length > 0 && (
            <TouchableOpacity style={styles.readBtn} onPress={readDigital} disabled={loadingRead}>
              <Text style={styles.readText}>{loadingRead ? '...' : '📱 Baca'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.favoriteBtn, isFavorite && { backgroundColor: '#ffe4e6' }]} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#e94560" : "#64748b"} />
          </TouchableOpacity>
        </View>
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
});
