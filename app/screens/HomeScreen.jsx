import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useBooks } from '../../hooks/useBooks';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

// Reusable/Stable Search Component to prevent focus loss
const SearchHeader = React.memo(function SearchHeader({
  fadeAnim,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  trendingBooks,
  navigation,
  currentSlide,
  sliderRef,
  setCurrentSlide,
  booksCount
}) {
  const renderTrending = () => (
    <View style={styles.sliderSection}>
      <View style={styles.sliderLabelRow}>
        <View style={styles.sliderLabelAccent} />
        <Text style={styles.sliderLabel}>SEDANG TREN</Text>
      </View>

      <FlatList
        ref={sliderRef}
        data={trendingBooks}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item?.books_id ?? item?.id ?? index)?.toString()}
        onMomentumScrollEnd={(e) => {
          setCurrentSlide(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH));
        }}
        renderItem={({ item }) => {
          const accent = '#e94560';
          return (
            <TouchableOpacity
              style={[styles.sliderCard, { backgroundColor: '#1a1a2e' }]}
              onPress={() => navigation.navigate('BookDetail', { id: item.books_id || item.id })}
            >
              <View style={[styles.sliderAccentBar, { backgroundColor: accent }]} />
              <View style={styles.sliderTopRow}>
                <View style={[styles.sliderGenreBadge, { borderColor: accent }]}>
                  <Text style={[styles.sliderGenreText, { color: accent }]}>
                    {item.category || 'Trending'}
                  </Text>
                </View>
                <Text style={styles.sliderRating}>★ {item.rating || '4.8'}</Text>
              </View>
              <Text style={styles.sliderEmoji}>📖</Text>
              <Text style={styles.sliderTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.sliderAuthor}>{item.publisher}</Text>
              <View style={styles.sliderBottomRow}>
                <Text style={styles.sliderSubtitle}>Baru di Perpustakaan</Text>
                <View style={[styles.sliderCta, { backgroundColor: accent }]}>
                  <Text style={styles.sliderCtaText}>Baca →</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <View style={styles.dotRow}>
        {trendingBooks.length > 1 && trendingBooks.map((_, i) => (
          <View key={i} style={[styles.dot, currentSlide === i ? styles.dotActive : null]} />
        ))}
      </View>
    </View>
  );

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>📚 PERPUSTAKAAN DIGITAL</Text>
        </View>
        <Text style={styles.heroTitle}>Temukan Buku{'\n'}Favoritmu.</Text>
        <Text style={styles.heroSub}>Ribuan koleksi buku tersedia untuk kamu jelajahi kapan saja.</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Judul, penulis, atau penerbit..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}><Text style={styles.statNumber}>2,400+</Text><Text style={styles.statLabel}>Koleksi Buku</Text></View>
        <View style={styles.statDivider} /><View style={styles.statItem}><Text style={styles.statNumber}>18</Text><Text style={styles.statLabel}>Kategori</Text></View>
        <View style={styles.statDivider} /><View style={styles.statItem}><Text style={styles.statNumber}>500+</Text><Text style={styles.statLabel}>Anggota Aktif</Text></View>
      </View>

      {renderTrending()}

      <View style={styles.sectionRow}>
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionAccent} /><Text style={styles.sectionTitle}>KATEGORI</Text>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.catList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, selectedCategory === item.id && styles.catChipActive]}
            onPress={() => onCategoryChange(item.id)}
          >
            <Text style={[styles.catIcon, selectedCategory === item.id && styles.catIconActive]}>{item.icon}</Text>
            <Text style={[styles.catLabel, selectedCategory === item.id && styles.catLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.bookListHeader}>
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionAccent} /><Text style={styles.sectionTitle}>{selectedCategory === 'All' ? 'SEMUA BUKU' : 'HASIL FILTER'}</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{booksCount}</Text></View>
      </View>
    </Animated.View>
  );
});

export default function HomeScreen({ navigation }) {
  const {
    books,
    trendingBooks,
    categories,
    loading,
    refreshing,
    fetchBooks,
    fetchDiscovery,
    onRefresh
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const searchTimeout = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        await fetchDiscovery();
      } catch (err) {
        console.error('Initial fetch failed:', err);
      }
    };
    init();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fetchDiscovery, fadeAnim]);

  useEffect(() => {
    if (trendingBooks.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % trendingBooks.length;
      try {
        sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      } catch (_error) { }
      setCurrentSlide(nextIndex);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentSlide, trendingBooks]);

  // Debounced search logic
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchBooks({
        q: text,
        category_id: selectedCategory === 'All' ? undefined : selectedCategory
      });
    }, 500); // 500ms delay
  }, [selectedCategory, fetchBooks]);

  const filterByCategory = useCallback((catId) => {
    setSelectedCategory(catId);
    fetchBooks({
      category_id: catId === 'All' ? undefined : catId,
      q: searchQuery
    });
  }, [searchQuery, fetchBooks]);

  const renderBookCard = useCallback(({ item, index }) => {
    const colors = ['#e94560', '#f5a623', '#52b788', '#6c63ff', '#00b4d8'];
    const accent = colors[index % colors.length];
    return (
      <TouchableOpacity style={styles.bookCard} onPress={() => navigation.navigate('BookDetail', { id: item.books_id || item.id })} activeOpacity={0.85}>
        <View style={[styles.bookCover, { backgroundColor: accent + '18' }]}>
          <View style={[styles.coverSpine, { backgroundColor: accent }]} /><Text style={styles.coverEmoji}>📖</Text><View style={styles.coverShine} />
        </View>
        <View style={styles.bookMeta}>
          <View style={[styles.categoryPill, { backgroundColor: accent + '18' }]}><Text style={[styles.categoryPillText, { color: accent }]}>{item.categories?.[0]?.name || 'Umum'}</Text></View>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookPublisher} numberOfLines={1}>{item.publisher}</Text>
          <View style={styles.bookFooter}>
            <View style={styles.ratingRow}><Text style={[styles.starIcon, { color: accent }]}>★</Text><Text style={styles.ratingText}>{item.rating || '4.5'}</Text></View>
            <Text style={styles.pagesText}>{item.pages || '200'} hal</Text>
          </View>
        </View>
        <View style={[styles.arrowBtn, { backgroundColor: accent }]}><Text style={styles.arrowIcon}>›</Text></View>
      </TouchableOpacity>
    );
  }, [navigation]);

  const stableHeader = useMemo(() => (
    <SearchHeader
      fadeAnim={fadeAnim}
      searchQuery={searchQuery}
      onSearchChange={handleSearch}
      selectedCategory={selectedCategory}
      onCategoryChange={filterByCategory}
      categories={categories}
      trendingBooks={trendingBooks}
      navigation={navigation}
      currentSlide={currentSlide}
      sliderRef={sliderRef}
      setCurrentSlide={setCurrentSlide}
      booksCount={books.length}
    />
  ), [fadeAnim, searchQuery, handleSearch, selectedCategory, filterByCategory, categories, trendingBooks, navigation, currentSlide, books.length]);

  if (loading && books.length === 0) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.loadingLabel}>Memuat koleksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f7f4" />
      <FlatList
        data={books}
        keyExtractor={(item, index) => (item?.books_id ?? item?.id ?? index)?.toString()}
        renderItem={renderBookCard}
        ListHeaderComponent={stableHeader}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Text style={styles.emptyEmoji}>🔍</Text><Text style={styles.emptyTitle}>Buku tidak ditemukan</Text><Text style={styles.emptySub}>Coba gunakan kata kunci yang berbeda</Text></View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1a1a2e']} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9f7f4' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f7f4' },
  loadingLabel: { marginTop: 14, fontSize: 15, color: '#6b7280', fontFamily: 'Georgia' },
  hero: { backgroundColor: '#1a1a2e', paddingTop: 52, paddingBottom: 40, paddingHorizontal: 24 },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#e94560' },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },
  heroTitle: { fontSize: 38, fontWeight: '800', color: '#ffffff', lineHeight: 46, marginBottom: 12, fontFamily: 'Georgia' },
  heroSub: { fontSize: 15, color: '#94a3b8', lineHeight: 22 },
  searchWrapper: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#1a1a2e' },
  searchBar: { backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, elevation: 5 },
  searchIcon: { fontSize: 22, color: '#6b7280', marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  clearBtn: { padding: 4 },
  clearIcon: { fontSize: 14, color: '#9ca3af' },
  statsBar: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 20, borderRadius: 12, paddingVertical: 16, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', fontFamily: 'Georgia' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#f1f5f9', marginVertical: 4 },
  sliderSection: { marginTop: 24, marginBottom: 8 },
  sliderLabelRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 },
  sliderLabelAccent: { width: 4, height: 14, backgroundColor: '#e94560', borderRadius: 2, marginRight: 10 },
  sliderLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  sliderCard: { width: CARD_WIDTH, marginHorizontal: 24, borderRadius: 20, padding: 24, minHeight: 190, position: 'relative', overflow: 'hidden' },
  sliderAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  sliderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sliderGenreBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  sliderGenreText: { fontSize: 11, fontWeight: '700' },
  sliderRating: { fontSize: 14, color: '#f5a623', fontWeight: '700' },
  sliderEmoji: { fontSize: 32, marginBottom: 8 },
  sliderTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 4, fontFamily: 'Georgia' },
  sliderAuthor: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  sliderBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderSubtitle: { fontSize: 13, color: '#64748b' },
  sliderCta: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  sliderCtaText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  dotRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d1d5db' },
  dotActive: { backgroundColor: '#1a1a2e', width: 20 },
  sectionRow: { paddingHorizontal: 24, marginTop: 28, marginBottom: 14 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center' },
  sectionAccent: { width: 4, height: 14, backgroundColor: '#e94560', borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  catList: { paddingHorizontal: 20, gap: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 6 },
  catChipActive: { backgroundColor: '#1a1a2e', borderColor: '#1a1a2e' },
  catIcon: { fontSize: 12, color: '#9ca3af' },
  catIconActive: { color: '#e94560' },
  catLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  catLabelActive: { color: '#ffffff' },
  bookListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 28, marginBottom: 16 },
  countBadge: { backgroundColor: '#1a1a2e', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  bookCard: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 14, borderRadius: 16, alignItems: 'center', padding: 16, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  bookCover: { width: 68, height: 88, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  coverSpine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  coverEmoji: { fontSize: 28 },
  coverShine: { position: 'absolute', top: 0, right: 0, width: 20, height: 20, backgroundColor: 'rgba(255,255,255,0.35)', borderTopRightRadius: 10, borderBottomLeftRadius: 14 },
  bookMeta: { flex: 1, marginLeft: 14 },
  categoryPill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  categoryPillText: { fontSize: 10, fontWeight: '700' },
  bookTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4, fontFamily: 'Georgia' },
  bookPublisher: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  bookFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  starIcon: { fontSize: 13, fontWeight: '700' },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  pagesText: { fontSize: 12, color: '#9ca3af' },
  arrowBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  arrowIcon: { fontSize: 22, color: '#ffffff', lineHeight: 26, marginTop: -2 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 8, fontFamily: 'Georgia' },
  emptySub: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
});