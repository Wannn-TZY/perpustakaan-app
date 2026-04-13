import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const faqs = [
  {
    q: 'Bagaimana cara meminjam buku?',
    a: 'Cari buku yang diinginkan, buka detail buku, lalu tekan tombol Pinjam. Tunggu persetujuan dari staff.',
  },
  {
    q: 'Berapa lama masa peminjaman?',
    a: 'Masa peminjaman adalah 7 hari. Bisa diajukan pengembalian kapan saja.',
  },
  {
    q: 'Bagaimana cara mengembalikan buku?',
    a: 'Buka detail buku atau profil, tekan tombol Ajukan Pengembalian. Staff akan mengkonfirmasi.',
  },
  {
    q: 'Tidak bisa login?',
    a: 'Pastikan email dan password benar. Gunakan fitur Lupa Password jika perlu.',
  },
];

export default function HelpScreen({ navigation }) {
  const openWhatsApp = () => {
    const phone = '6289637383226';
    const message = 'Halo, saya butuh bantuan terkait aplikasi Perpustakaan Digital';
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ─────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bantuan</Text>
        </View>

        {/* ── WhatsApp Button ───────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HUBUNGI KAMI</Text>
          <TouchableOpacity style={styles.waButton} onPress={openWhatsApp}>
            <View style={styles.waIcon}>
              <Ionicons name="logo-whatsapp" size={28} color="#fff" />
            </View>
            <View style={styles.waText}>
              <Text style={styles.waTitle}>Chat WhatsApp</Text>
              <Text style={styles.waSub}>0896 3738 3226</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#52b788" />
          </TouchableOpacity>
        </View>

        {/* ── FAQ ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERTANYAAN UMUM</Text>
          <View style={styles.faqCard}>
            {faqs.map((faq, i) => (
              <View key={i} style={[styles.faqItem, i < faqs.length - 1 && styles.faqBorder]}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Text style={styles.faqA}>{faq.a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  header: {
    backgroundColor: NAVY,
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5, marginBottom: 12 },
  waButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  waIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#52b788',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  waText: { flex: 1 },
  waTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  waSub: { fontSize: 14, color: '#6b7280' },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  faqItem: { padding: 16 },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  faqQ: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  faqA: { fontSize: 13, color: '#6b7280', lineHeight: 20 },
});
