import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Linking,
} from 'react-native';
import { useRef, useEffect } from 'react';
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
  { name: 'Ahmad Fauzi', role: 'Lead Developer', emoji: '👨‍💻' },
  { name: 'Siti Rahma', role: 'UI/UX Designer', emoji: '🎨' },
  { name: 'Rizky Pratama', role: 'Backend Engineer', emoji: '⚙️' },
];

const links = [
  { icon: 'globe-outline', label: 'Website Kami', url: 'https://example.com', accent: '#6c63ff' },
  { icon: 'mail-outline', label: 'Hubungi Kami', url: 'mailto:support@example.com', accent: '#00b4d8' },
  { icon: 'logo-github', label: 'GitHub', url: 'https://github.com', accent: '#1a1a2e' },
];

export default function AboutScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ───────────────────────────────────────────── */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>ℹ️ TENTANG APLIKASI</Text>
          </View>

          {/* App Logo */}
          <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>📚</Text>
              </View>
            </View>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>v1.0.0</Text>
            </View>
          </Animated.View>

          <Text style={styles.appName}>Perpustakaan{'\n'}Digital</Text>
          <Text style={styles.appTagline}>
            Baca lebih banyak, pelajari lebih dalam.
          </Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── About Blurb ─────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>TENTANG KAMI</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.aboutText}>
                Perpustakaan Digital hadir untuk memudahkan akses terhadap ribuan koleksi buku
                berkualitas. Kami percaya bahwa membaca adalah hak semua orang — kapan saja,
                di mana saja.
              </Text>
              <View style={styles.aboutDivider} />
              <Text style={styles.aboutText}>
                Dibangun dengan semangat literasi, aplikasi ini menghubungkan pembaca dengan
                buku-buku terbaik dari berbagai kategori — mulai fiksi, sains, teknologi, hingga pengembangan diri.
              </Text>
            </View>
          </View>

          {/* ── Features ────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>FITUR UNGGULAN</Text>
            </View>
            <View style={styles.card}>
              {features.map((f, i) => (
                <View key={i} style={[styles.featureRow, i < features.length - 1 && styles.featureRowBorder]}>
                  <View style={[styles.featureIcon, { backgroundColor: f.accent + '18' }]}>
                    <Ionicons name={f.icon} size={20} color={f.accent} />
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={f.accent} />
                </View>
              ))}
            </View>
          </View>

          {/* ── Team ────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>TIM PENGEMBANG</Text>
            </View>
            <View style={styles.teamRow}>
              {team.map((member, i) => (
                <View key={i} style={styles.teamCard}>
                  <View style={styles.teamAvatar}>
                    <Text style={styles.teamEmoji}>{member.emoji}</Text>
                  </View>
                  <Text style={styles.teamName}>{member.name.split(' ')[0]}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Links ───────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>TAUTAN</Text>
            </View>
            <View style={styles.card}>
              {links.map((link, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.linkRow, i < links.length - 1 && styles.linkRowBorder]}
                  onPress={() => Linking.openURL(link.url)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.linkIcon, { backgroundColor: link.accent + '18' }]}>
                    <Ionicons name={link.icon} size={19} color={link.accent} />
                  </View>
                  <Text style={styles.linkLabel}>{link.label}</Text>
                  <View style={[styles.linkArrow, { backgroundColor: link.accent + '12' }]}>
                    <Ionicons name="arrow-forward" size={14} color={link.accent} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Tech Stack ──────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>DIBANGUN DENGAN</Text>
            </View>
            <View style={styles.techRow}>
              {[
                { label: 'React Native', icon: '⚛️' },
                { label: 'Expo', icon: '🚀' },
                { label: 'Node.js', icon: '🟢' },
                { label: 'MySQL', icon: '🗄️' },
              ].map((t, i) => (
                <View key={i} style={styles.techChip}>
                  <Text style={styles.techEmoji}>{t.icon}</Text>
                  <Text style={styles.techLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Footer ──────────────────────────────────────── */}
          <View style={styles.footer}>
            <View style={styles.footerLogoRow}>
              <Text style={styles.footerLogoEmoji}>📚</Text>
              <Text style={styles.footerLogoText}>Perpustakaan Digital</Text>
            </View>
            <Text style={styles.footerVersion}>Versi 1.0.0  •  © 2025 Tim Pengembang</Text>
            <Text style={styles.footerLove}>Dibuat dengan ❤️ di Indonesia</Text>
          </View>

        </Animated.View>
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
    paddingBottom: 44,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
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
    marginBottom: 28,
    borderLeftWidth: 3,
    borderLeftColor: RED,
  },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },

  // Logo
  logoWrap: { alignSelf: 'center', marginBottom: 24, position: 'relative' },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  logoInner: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: { fontSize: 36 },
  logoBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#f5a623',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: NAVY,
  },
  logoBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Georgia',
    lineHeight: 44,
    marginBottom: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 14,
    color: '#94a3b8',
    alignSelf: 'center',
    letterSpacing: 0.3,
    fontStyle: 'italic',
  },

  // ── Section
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  // About
  aboutText: { fontSize: 14, color: '#374151', lineHeight: 22, letterSpacing: 0.15 },
  aboutDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 14 },

  // Features
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1f2937' },

  // Team
  teamRow: { flexDirection: 'row', gap: 12 },
  teamCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  teamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: NAVY + '0f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  teamEmoji: { fontSize: 26 },
  teamName: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3, textAlign: 'center' },
  teamRole: { fontSize: 10, color: '#9ca3af', textAlign: 'center', letterSpacing: 0.3 },

  // Links
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  linkRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1f2937' },
  linkArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tech Stack
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  techChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 7,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  techEmoji: { fontSize: 16 },
  techLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 8 },
  footerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  footerLogoEmoji: { fontSize: 20 },
  footerLogoText: { fontSize: 15, fontWeight: '700', color: NAVY, fontFamily: 'Georgia' },
  footerVersion: { fontSize: 12, color: '#9ca3af', letterSpacing: 0.3 },
  footerLove: { fontSize: 12, color: '#c4c9d4', letterSpacing: 0.2 },
});