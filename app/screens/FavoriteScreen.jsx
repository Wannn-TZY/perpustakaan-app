import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useBooks } from '../../hooks/useBooks';
import bookService from '../services/bookService';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const accentColors = ['#e94560', '#6c63ff', '#f5a623', '#52b788', '#00b4d8', '#f97316'];

export default function FavoriteScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { books: favorites, loading, fetchFavorites } = useBooks();
  const [removingId, setRemovingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) fetchFavorites();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [isFocused]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handleRemove = async (bookmarkId) => {
    try {
      setRemovingId(bookmarkId);
      await bookService.toggleBookmark(null, true, bookmarkId);
      fetchFavorites();
    } catch (error) {
      alert('Gagal menghapus favorit');
    } finally {
      setRemovingId(null);
    }
  };


  const ListHeader = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#94a3b8" />
        </TouchableOpacity>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>❤️ BUKU FAVORIT</Text>
        </View>
        <Text style={styles.heroTitle}>Koleksi{'\n'}Pilihanmu.</Text>
        <Text style={styles.heroSub}>Buku-buku yang kamu tandai sebagai favorit.</Text>
        <View style={styles.heroChip}>
          <Text style={styles.heroChipText}>{favorites.length} buku tersimpan</Text>
        </View>
      </View>

      <View style={styles.sortBar}>
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>SEMUA FAVORIT</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{favorites.length}</Text></View>
      </View>
    </Animated.View>
  );

  const renderItem = ({ item, index }) => {
    const accent = accentColors[index % accentColors.length];
    const isRemoving = removingId === item.bookmarks_id;
    const book = item.book;

    if (!book) return null;

    return (
      <Animated.View style={{ opacity: isRemoving ? 0.3 : 1 }}>
        <TouchableOpacity
          style={styles.bookCard}
          activeOpacity={0.82}
          onPress={() => navigation.navigate('BookDetail', { id: book.books_id })}
        >
          <View style={[styles.cover, { backgroundColor: accent + '18' }]}>
            <View style={[styles.coverSpine, { backgroundColor: accent }]} />
            <Text style={styles.coverEmoji}>📖</Text><View style={styles.coverShine} />
          </View>
          <View style={styles.bookMeta}>
            <View style={[styles.genrePill, { backgroundColor: accent + '18' }]}><Text style={[styles.genreText, { color: accent }]}>{book.categories?.[0]?.name || 'Umum'}</Text></View>
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.authors?.map(a => a.name).join(', ') || 'Penulis Anonim'}</Text>
            <View style={styles.bookFooter}>
              <View style={styles.ratingRow}><Text style={[styles.star, { color: accent }]}>★</Text><Text style={styles.ratingText}>{book.rating || '4.5'}</Text></View>
              <Text style={styles.pagesText}>{book.pages || '200'} hal</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.bookmarks_id)}><Ionicons name="heart-dislike-outline" size={16} color={RED} /></TouchableOpacity>
            <View style={[styles.arrowBtn, { backgroundColor: accent }]}><Text style={styles.arrowText}>›</Text></View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item?.bookmarks_id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={loading ? null : () => (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}><Text style={styles.emptyEmoji}>💔</Text></View>
            <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
            <Text style={styles.emptySub}>Tandai buku yang kamu sukai untuk{'\n'}menyimpannya di sini.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Home')}><Ionicons name="search-outline" size={16} color="#fff" /><Text style={styles.emptyBtnText}>Jelajahi Buku</Text></TouchableOpacity>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  hero: { backgroundColor: NAVY, paddingTop: 52, paddingBottom: 36, paddingHorizontal: 24 },
  backBtn: { marginBottom: 20, width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: RED },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },
  heroTitle: { fontSize: 38, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', lineHeight: 46, marginBottom: 10 },
  heroSub: { fontSize: 14, color: '#94a3b8', lineHeight: 21, marginBottom: 20 },
  heroChip: { alignSelf: 'flex-start', backgroundColor: RED, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  heroChipText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  sortBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center' },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  countBadge: { backgroundColor: NAVY, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  bookCard: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 14, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  cover: { width: 68, height: 88, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  coverSpine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  coverEmoji: { fontSize: 28 },
  coverShine: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, backgroundColor: 'rgba(255,255,255,0.35)', borderTopRightRadius: 10, borderBottomLeftRadius: 12 },
  bookMeta: { flex: 1, marginLeft: 14 },
  genrePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  genreText: { fontSize: 10, fontWeight: '700' },
  bookTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Georgia', lineHeight: 20, marginBottom: 4 },
  bookAuthor: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  bookFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { fontSize: 13, fontWeight: '700' },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  pagesText: { fontSize: 12, color: '#9ca3af' },
  actions: { alignItems: 'center', gap: 8, marginLeft: 10 },
  removeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: RED + '12', justifyContent: 'center', alignItems: 'center' },
  arrowBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  arrowText: { fontSize: 22, color: '#fff', lineHeight: 26, marginTop: -2 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: RED + '12', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: NAVY, fontFamily: 'Georgia', marginBottom: 10 },
  emptySub: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, gap: 8, elevation: 4 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});