import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const contacts = [
  {
    icon: 'mail-outline',
    label: 'Email Support',
    value: 'support@perpustakaan.com',
    sub: 'Balas dalam 1×24 jam',
    accent: '#6c63ff',
    action: () => Linking.openURL('mailto:support@perpustakaan.com'),
  },
  {
    icon: 'logo-whatsapp',
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
    sub: 'Senin–Jumat, 08.00–17.00',
    accent: '#52b788',
    action: () => Linking.openURL('https://wa.me/6281234567890'),
  },
  {
    icon: 'call-outline',
    label: 'Telepon',
    value: '021-1234-5678',
    sub: 'Jam kerja: 08.00–17.00 WIB',
    accent: '#f5a623',
    action: () => Linking.openURL('tel:02112345678'),
  },
  {
    icon: 'chatbubbles-outline',
    label: 'Live Chat',
    value: 'Chat langsung dengan kami',
    sub: 'Tersedia di aplikasi',
    accent: '#00b4d8',
    action: () => {},
  },
];

const faqs = [
  {
    q: 'Bagaimana cara meminjam buku?',
    a: 'Cari buku yang ingin kamu baca, buka halaman detailnya, lalu tekan tombol "Pinjam Sekarang". Buku akan langsung tersedia di akun kamu selama 14 hari.',
  },
  {
    q: 'Berapa lama masa peminjaman buku?',
    a: 'Masa peminjaman standar adalah 14 hari. Kamu dapat memperpanjang peminjaman hingga 2 kali selama buku tidak dalam antrean oleh anggota lain.',
  },
  {
    q: 'Apakah saya bisa membaca secara offline?',
    a: 'Ya! Kamu dapat mengunduh buku terlebih dahulu saat terhubung ke internet, lalu membacanya kapan saja tanpa koneksi.',
  },
  {
    q: 'Bagaimana cara menambah buku ke favorit?',
    a: 'Buka halaman detail buku, lalu tekan ikon ❤️ di pojok kanan atas. Buku akan tersimpan otomatis di menu Favorit kamu.',
  },
  {
    q: 'Apa yang harus dilakukan jika lupa password?',
    a: 'Buka halaman login, tekan "Lupa Password", masukkan email kamu, dan kami akan mengirimkan tautan reset password dalam beberapa menit.',
  },
];

const guides = [
  { icon: 'book-outline', label: 'Panduan Peminjaman', accent: '#6c63ff' },
  { icon: 'person-outline', label: 'Kelola Akun', accent: '#f5a623' },
  { icon: 'download-outline', label: 'Unduh & Baca Offline', accent: '#52b788' },
  { icon: 'notifications-outline', label: 'Pengaturan Notifikasi', accent: RED },
];

export default function HelpScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const toggleFaq = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🛟 BANTUAN & DUKUNGAN</Text>
          </View>
          <Text style={styles.heroTitle}>Ada yang Bisa{'\n'}Kami Bantu?</Text>
          <Text style={styles.heroSub}>
            Tim kami siap membantu kamu 24/7. Pilih cara yang paling nyaman.
          </Text>

          {/* Search bar hint */}
          <TouchableOpacity style={styles.searchHint} activeOpacity={0.8}>
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <Text style={styles.searchHintText}>Cari topik bantuan...</Text>
            <View style={styles.searchKbd}><Text style={styles.searchKbdText}>⌘K</Text></View>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── Quick Guides ─────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>PANDUAN CEPAT</Text>
            </View>
            <View style={styles.guidesGrid}>
              {guides.map((g, i) => (
                <TouchableOpacity key={i} style={styles.guideCard} activeOpacity={0.8}>
                  <View style={[styles.guideIcon, { backgroundColor: g.accent + '18' }]}>
                    <Ionicons name={g.icon} size={24} color={g.accent} />
                  </View>
                  <Text style={styles.guideLabel}>{g.label}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#d1d5db" style={{ marginTop: 2 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Contact ──────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>HUBUNGI KAMI</Text>
            </View>
            <View style={styles.card}>
              {contacts.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.contactRow, i < contacts.length - 1 && styles.contactRowBorder]}
                  onPress={c.action}
                  activeOpacity={0.75}
                >
                  <View style={[styles.contactIcon, { backgroundColor: c.accent + '18' }]}>
                    <Ionicons name={c.icon} size={22} color={c.accent} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{c.label}</Text>
                    <Text style={styles.contactValue}>{c.value}</Text>
                    <Text style={styles.contactSub}>{c.sub}</Text>
                  </View>
                  <View style={[styles.contactArrow, { backgroundColor: c.accent + '12' }]}>
                    <Ionicons name="arrow-forward" size={14} color={c.accent} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── FAQ ──────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>PERTANYAAN UMUM</Text>
            </View>
            <View style={styles.card}>
              {faqs.map((faq, i) => (
                <View key={i} style={[i < faqs.length - 1 && styles.faqItemBorder]}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFaq(i)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.faqNumBadge, openFaq === i && { backgroundColor: RED }]}>
                      <Text style={styles.faqNum}>{String(i + 1).padStart(2, '0')}</Text>
                    </View>
                    <Text style={[styles.faqQ, openFaq === i && { color: NAVY }]}>{faq.q}</Text>
                    <View style={[styles.faqChevron, openFaq === i && styles.faqChevronOpen]}>
                      <Ionicons name="chevron-down" size={16} color={openFaq === i ? RED : '#9ca3af'} />
                    </View>
                  </TouchableOpacity>
                  {openFaq === i && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqA}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* ── Still Need Help ───────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.helpCard}>
              <View style={styles.helpCardLeft}>
                <Text style={styles.helpCardEmoji}>🤝</Text>
                <View>
                  <Text style={styles.helpCardTitle}>Masih butuh bantuan?</Text>
                  <Text style={styles.helpCardSub}>Tim kami selalu siap untukmu</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.helpCardBtn}
                onPress={() => Linking.openURL('mailto:support@perpustakaan.com')}
              >
                <Text style={styles.helpCardBtnText}>Hubungi</Text>
              </TouchableOpacity>
            </View>
          </View>

        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },

  // ── Hero
  hero: {
    backgroundColor: NAVY,
    paddingTop: 52,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  backBtn: {
    marginBottom: 20,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: RED,
  },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Georgia',
    lineHeight: 42,
    marginBottom: 10,
  },
  heroSub: { fontSize: 14, color: '#94a3b8', lineHeight: 21, marginBottom: 20 },
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 10,
  },
  searchHintText: { flex: 1, fontSize: 14, color: '#64748b' },
  searchKbd: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchKbdText: { fontSize: 11, color: '#475569', fontWeight: '600' },

  // ── Section
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  // ── Guides
  guidesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  guideCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  guideIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 18,
    flex: 1,
  },

  // ── Contact
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  contactRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 3 },
  contactValue: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  contactSub: { fontSize: 12, color: '#9ca3af' },
  contactArrow: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // ── FAQ
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqNum: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151', lineHeight: 20 },
  faqChevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f9f7f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqChevronOpen: { backgroundColor: RED + '12', transform: [{ rotate: '180deg' }] },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    marginLeft: 40,
  },
  faqA: { fontSize: 13, color: '#6b7280', lineHeight: 21 },

  // ── Still Need Help
  helpCard: {
    backgroundColor: NAVY,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  helpCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  helpCardEmoji: { fontSize: 32 },
  helpCardTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3, fontFamily: 'Georgia' },
  helpCardSub: { fontSize: 12, color: '#64748b' },
  helpCardBtn: {
    backgroundColor: RED,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
  helpCardBtnText: { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
});