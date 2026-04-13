import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const features = [
  { icon: 'library-outline', label: 'Koleksi 2.400+ Buku', accent: '#6c63ff' },
  { icon: 'search-outline', label: 'Pencarian Cerdas', accent: '#00b4d8' },
  { icon: 'heart-outline', label: 'Daftar Favorit Pribadi', accent: RED },
  { icon: 'lock-closed-outline', label: 'Keamanan Akun Terjamin', accent: '#52b788' },
  { icon: 'phone-portrait-outline', label: 'Tersedia di Android & iOS', accent: '#f5a623' },
];

const team = [
  { name: 'Ilal', role: 'Frontend Developer', emoji: '👨‍💻' },
  { name: 'Ridwan', role: 'Backend Developer', emoji: '⚙️' },
];

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ─────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        </View>

        {/* ── Logo ───────────────────────────────── */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.appName}>Perpustakaan Digital</Text>
          <Text style={styles.version}>Versi 1.0.0</Text>
        </View>

        {/* ── Tentang ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TENTANG KAMI</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              Perpustakaan Digital memudahkan akses terhadap ribuan koleksi buku berkualitas. 
              Membaca adalah hak semua orang — kapan saja, di mana saja.
            </Text>
          </View>
        </View>

        {/* ── Fitur ─────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FITUR</Text>
          <View style={styles.card}>
            {features.map((f, i) => (
              <View key={i} style={[styles.featureRow, i < features.length - 1 && styles.featureBorder]}>
                <View style={[styles.featureIcon, { backgroundColor: f.accent + '18' }]}>
                  <Ionicons name={f.icon} size={18} color={f.accent} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Tim ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TIM PENGEMBANG</Text>
          <View style={styles.teamRow}>
            {team.map((member, i) => (
              <View key={i} style={styles.teamCard}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamEmoji}>{member.emoji}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Footer ────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Perpustakaan Digital</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  header: {
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  logoSection: { backgroundColor: NAVY, alignItems: 'center', paddingBottom: 36 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: 'Georgia', marginBottom: 4 },
  version: { fontSize: 13, color: '#94a3b8' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5, marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  aboutText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  featureBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1f2937' },
  teamRow: { flexDirection: 'row', gap: 12 },
  teamCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  teamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: NAVY + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamEmoji: { fontSize: 26 },
  teamName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  teamRole: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  footer: { alignItems: 'center', paddingVertical: 36 },
  footerText: { fontSize: 13, color: '#9ca3af' },
});
