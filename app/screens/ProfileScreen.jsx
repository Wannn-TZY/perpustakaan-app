import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useContext, useRef, useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const menuGroups = [
  {
    title: 'AKUN',
    items: [
      { icon: 'person-outline', label: 'Edit Profil', accent: '#6c63ff', nav: 'EditProfile' },
      { icon: 'notifications-outline', label: 'Notifikasi', accent: '#f5a623', nav: 'Notifications' },
      { icon: 'lock-closed-outline', label: 'Privasi & Keamanan', accent: '#52b788', nav: 'Privacy' },
    ],
  },
  {
    title: 'LAINNYA',
    items: [
      { icon: 'settings-outline', label: 'Pengaturan', accent: '#00b4d8', nav: 'Settings' },
      { icon: 'help-circle-outline', label: 'Bantuan & Dukungan', accent: '#f5a623', nav: 'Help' },
      { icon: 'information-circle-outline', label: 'Tentang Aplikasi', accent: '#52b788', nav: 'About' },
    ],
  },
];

export default function ProfileScreen() {
  const { showToast } = useToast();
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    user,
    stats,
    activeLoan,
    unreadCount,
    uploading,
    fetchProfileData,
    uploadAvatar,
  } = useProfile();

  const { verifyOTP, resendVerification, loading: authLoading } = useAuth();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (isFocused) {
      fetchProfileData();
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Maaf, kami butuh izin galeri untuk mengganti foto profil.', 'error');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      showToast('Kode verifikasi harus 6 digit ya.', 'warning');
      return;
    }
    const success = await verifyOTP(otpCode);
    if (success) {
      setShowVerifyModal(false);
      setOtpCode('');
      fetchProfileData();
    }
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* ── Hero Header ────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>👤 PROFIL SAYA</Text>
        </View>

        <View style={styles.avatarWrapper}>
          <TouchableOpacity style={styles.avatarRing} onPress={handlePickAvatar} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color={RED} size="large" />
            ) : (
              <Image
                source={{
                  uri: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || 'User'
                  )}&size=200&background=e94560&color=fff&bold=true`,
                }}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickAvatar} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="camera" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'Nama Pengguna'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>

        {user?.email_verified_at ? (
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>✦ Anggota Terverifikasi</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.memberBadge, { borderColor: '#f5a623', backgroundColor: '#f5a62315' }]}
            onPress={() => setShowVerifyModal(true)}
          >
            <Text style={[styles.memberText, { color: '#f5a623' }]}>⚠ Belum Diverifikasi</Text>
            <Text style={styles.verifyLink}>Klik untuk Verifikasi</Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {/* ── Stats ──────────────────────────────────────────────── */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.statWrapper}
            onPress={() => navigation.navigate('MyLoans')}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: RED }]}>{stats.loans}</Text>
              <Text style={styles.statLabel}>Dipinjam</Text>
            </View>
            <View style={styles.statDivider} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statWrapper}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f5a623' }]}>{stats.favorites}</Text>
              <Text style={styles.statLabel}>Favorit</Text>
            </View>
            <View style={styles.statDivider} />
          </TouchableOpacity>

          <View style={styles.statWrapper}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#52b788' }]}>{stats.reviews}</Text>
              <Text style={styles.statLabel}>Ulasan</Text>
            </View>
          </View>
        </View>

        {/* ── Currently Reading ──────────────────────────────────── */}
        <View style={styles.readingSection}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>STATUS PEMINJAMAN TERAKHIR</Text>
          </View>

          {activeLoan ? (
            <View style={styles.readingCard}>
              <View style={styles.readingCover}>
                <View style={styles.readingSpine} />
                <Text style={styles.readingEmoji}>📖</Text>
              </View>
              <View style={styles.readingInfo}>
                <Text style={styles.readingTitle} numberOfLines={1}>{activeLoan.book?.title}</Text>
                <Text style={styles.readingAuthor}>{activeLoan.status.toUpperCase()}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, {
                    width: activeLoan.status === 'borrowed' || activeLoan.status === 'active' || activeLoan.status === 'overdue' ? '100%' :
                      activeLoan.status === 'returning' ? '75%' : '50%'
                  }]} />
                </View>
                <Text style={styles.progressText}>
                  {activeLoan.status === 'borrowed' || activeLoan.status === 'active' || activeLoan.status === 'overdue' ? 'Sedang Dipinjam' :
                    activeLoan.status === 'returning' ? 'Menunggu Konfirmasi Pengembalian' : 'Menunggu Persetujuan'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => navigation.navigate('MyLoans')}
              >
                <Text style={styles.continueBtnText}>›</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.readingCard, { justifyContent: 'center', paddingVertical: 24 }]}>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>Tidak ada pinjaman aktif</Text>
            </View>
          )}
        </View>

        {/* ── Menu Groups ───────────────────────────────────────── */}
        {menuGroups.map((group, gi) => (
          <View key={gi} style={styles.menuSection}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>{group.title}</Text>
            </View>

            <View style={styles.menuCard}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.menuRow,
                    idx < group.items.length - 1 && styles.menuRowBorder,
                  ]}
                  onPress={() => navigation.navigate(item.nav)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.accent + '18' }]}>
                    <Ionicons name={item.icon} size={20} color={item.accent} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.nav === 'Notifications' && unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{unreadCount}</Text>
                    </View>
                  )}
                  <View style={styles.menuArrow}>
                    <Text style={styles.menuArrowText}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* ── Logout ─────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={RED} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>📚 Perpustakaan Digital</Text>
          <Text style={styles.footerVersion}>Versi 1.0.0</Text>
        </View>
      </Animated.View>

      {/* ── Verification Modal ───────────────────────────────────── */}
      <Modal
        visible={showVerifyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#f5a62315' }]}>
                <Ionicons name="mail-open-outline" size={24} color="#f5a623" />
              </View>
              <Text style={styles.modalTitle}>Verifikasi Email</Text>
              <Text style={styles.modalSub}>Masukkan 6 digit kode yang dikirim ke email kamu</Text>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => { setShowVerifyModal(false); setOtpCode(''); }}
              >
                <Ionicons name="close" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
              letterSpacing={10}
              textAlign="center"
            />

            <TouchableOpacity
              style={[styles.verifySubmit, authLoading && { opacity: 0.7 }]}
              onPress={handleVerify}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.verifySubmitText}>Verifikasi Sekarang</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={resendVerification}
              disabled={authLoading}
            >
              <Text style={styles.resendText}>Belum terima kode? Kirim ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  hero: { backgroundColor: NAVY, alignItems: 'center', paddingTop: 52, paddingBottom: 40, paddingHorizontal: 24 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: RED, alignSelf: 'flex-start' },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarRing: { width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: RED, padding: 3, backgroundColor: NAVY },
  avatar: { width: 98, height: 98, borderRadius: 49 },
  cameraBtn: { position: 'absolute', bottom: 2, right: 2, backgroundColor: RED, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: NAVY },
  userName: { fontSize: 26, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', marginBottom: 6, textAlign: 'center' },
  userEmail: { fontSize: 14, color: '#94a3b8', marginBottom: 16, letterSpacing: 0.3 },
  memberBadge: { backgroundColor: 'rgba(233, 69, 96, 0.15)', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(233,69,96,0.4)' },
  memberText: { fontSize: 12, color: RED, fontWeight: '700', letterSpacing: 1.5 },
  statsCard: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 20, borderRadius: 16, paddingVertical: 20, shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  statWrapper: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: '800', fontFamily: 'Georgia', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9ca3af', letterSpacing: 0.5, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: '#f1f5f9' },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  readingSection: { paddingHorizontal: 20, marginTop: 28 },
  readingCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  readingCover: { width: 56, height: 72, backgroundColor: '#e9456018', borderRadius: 8, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  readingSpine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: RED, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  readingEmoji: { fontSize: 24 },
  readingInfo: { flex: 1, marginLeft: 14 },
  readingTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Georgia', marginBottom: 2 },
  readingAuthor: { fontSize: 12, color: '#9ca3af', marginBottom: 10 },
  progressBarBg: { height: 5, backgroundColor: '#f1f5f9', borderRadius: 3, marginBottom: 5, overflow: 'hidden' },
  progressBarFill: { height: 5, backgroundColor: RED, borderRadius: 3 },
  progressText: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  continueBtn: { width: 32, height: 32, backgroundColor: NAVY, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  continueBtnText: { fontSize: 22, color: '#fff', lineHeight: 26, marginTop: -2 },
  menuSection: { paddingHorizontal: 20, marginTop: 28 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 4, shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937', letterSpacing: 0.1 },
  menuArrow: { width: 28, height: 28, backgroundColor: CREAM, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuArrowText: { fontSize: 20, color: '#9ca3af', lineHeight: 24, marginTop: -2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 14, borderWidth: 2, borderColor: RED, backgroundColor: '#ffffff', gap: 10, shadowColor: RED, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  logoutText: { fontSize: 15, fontWeight: '700', color: RED, letterSpacing: 0.3 },
  footer: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  footerLogo: { fontSize: 13, fontWeight: '600', color: '#9ca3af', fontFamily: 'Georgia' },
  footerVersion: { fontSize: 11, color: '#d1d5db', letterSpacing: 0.5 },
  unreadBadge: { backgroundColor: RED, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginRight: 8 },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  verifyLink: { fontSize: 9, color: '#f5a623', fontWeight: '500', marginTop: 2, textAlign: 'center', textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 26, 46, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', position: 'relative' },
  closeModal: { position: 'absolute', top: 16, right: 16, padding: 4 },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  modalIconWrap: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: NAVY, fontFamily: 'Georgia', marginBottom: 8 },
  modalSub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', paddingHorizontal: 20, lineHeight: 18 },
  otpInput: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 12, paddingVertical: 16, fontSize: 24, fontWeight: '700', color: NAVY, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  verifySubmit: { backgroundColor: NAVY, width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  verifySubmitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resendBtn: { marginTop: 16, padding: 8 },
  resendText: { fontSize: 13, color: '#6c63ff', fontWeight: '600' },
});
