import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
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
import { useLoans } from '../../hooks/useLoans';

const NAVY  = '#1a1a2e';
const RED   = '#e94560';
const CREAM = '#f9f7f4';

// ── Avatar URI helper ──────────────────────────────────────
// Prioritas: localPreview → server URL (cache-busted) → UI-Avatars
const getAvatarUri = (user, localPreview) => {
  if (localPreview) return localPreview;

  if (user?.avatar_url && user.avatar_url.startsWith('http')) {
    // ✅ Cache-bust: paksa reload setiap kali _avatarUpdatedAt berubah
    const sep = user.avatar_url.includes('?') ? '&' : '?';
    return `${user.avatar_url}${sep}t=${user._avatarUpdatedAt || ''}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'User'
  )}&size=200&background=e94560&color=fff&bold=true`;
};

const menuGroups = [
  {
    title: 'AKUN',
    items: [
      { icon: 'person-outline',        label: 'Edit Profil',        accent: '#6c63ff', nav: 'EditProfile'   },
      { icon: 'notifications-outline', label: 'Notifikasi',         accent: '#f5a623', nav: 'Notifications' },
      { icon: 'lock-closed-outline',   label: 'Privasi & Keamanan', accent: '#52b788', nav: 'Privacy'       },
    ],
  },
  {
    title: 'LAINNYA',
    items: [
      { icon: 'settings-outline',           label: 'Pengaturan',         accent: '#00b4d8', nav: 'Settings' },
      { icon: 'help-circle-outline',        label: 'Bantuan & Dukungan', accent: '#f5a623', nav: 'Help'     },
      { icon: 'information-circle-outline', label: 'Tentang Aplikasi',   accent: '#52b788', nav: 'About'    },
    ],
  },
];

export default function ProfileScreen() {
  const { showToast } = useToast();
  const { logout }    = useContext(AuthContext);
  const navigation    = useNavigation();
  const isFocused     = useIsFocused();
  const fadeAnim      = useRef(new Animated.Value(0)).current;

  const { user, stats, activeLoan, unreadCount, uploading, fetchProfileData, uploadAvatar } = useProfile();
  const { verifyOTP, resendVerification, loading: authLoading } = useAuth();
  const { requestReturn, loading: returnLoading } = useLoans();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode]                 = useState('');
  const [showReturnModal, setShowReturnModal]  = useState(false);

  // ✅ Preview lokal — ditampilkan SEGERA setelah user pilih foto
  //    sebelum server selesai menerima upload, supaya tidak tampak hitam
  const [localAvatarPreview, setLocalAvatarPreview] = useState(null);

  useEffect(() => {
    if (isFocused) fetchProfileData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [isFocused, fadeAnim, fetchProfileData]);

  // ── Pick & Upload ─────────────────────────────────────────
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Butuh izin galeri untuk mengganti foto profil.', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    // ✅ Langsung tampilkan foto baru tanpa tunggu upload
    setLocalAvatarPreview(asset.uri);

    const success = await uploadAvatar(asset.uri);

    if (success) {
      showToast('Foto profil berhasil diperbarui ✓', 'success');
      await fetchProfileData(); // sync dari server
    } else {
      showToast('Gagal mengunggah foto. Coba lagi.', 'error');
    }

    // Hapus preview lokal — pakai URL dari server (atau fallback)
    setLocalAvatarPreview(null);
  };

  // ── OTP Verify ────────────────────────────────────────────
  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      showToast('Kode verifikasi harus 6 digit.', 'warning');
      return;
    }
    const success = await verifyOTP(otpCode);
    if (success) {
      setShowVerifyModal(false);
      setOtpCode('');
      fetchProfileData();
    }
  };

  const avatarUri = getAvatarUri(user, localAvatarPreview);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>👤 PROFIL SAYA</Text>
        </View>

        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            style={styles.avatarRing}
            onPress={handlePickAvatar}
            disabled={uploading}
            activeOpacity={0.85}
          >
            {/* ✅ key={avatarUri} memaksa Image remount saat URI berubah
                sehingga React Native tidak pakai cache gambar lama */}
            <Image
              key={avatarUri}
              source={{ uri: avatarUri }}
              style={styles.avatar}
              resizeMode="cover"
              onError={() => setLocalAvatarPreview(null)}
            />

            {/* Overlay gelap + spinner saat upload berlangsung */}
            {uploading && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="#fff" size="large" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={handlePickAvatar}
            disabled={uploading}
          >
            {uploading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Ionicons name="camera" size={16} color="#fff" />
            }
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

        {/* ── Stats ────────────────────────────────────────── */}
        <View style={styles.statsCard}>
          {[
            { num: stats?.loans,     label: 'Dipinjam', color: RED,       nav: 'MyLoans'   },
            { num: stats?.favorites, label: 'Favorit',  color: '#f5a623', nav: 'Favorites' },
            { num: stats?.reviews,   label: 'Ulasan',   color: '#52b788', nav: null        },
          ].map((s, i, arr) => (
            <TouchableOpacity
              key={i}
              style={styles.statWrapper}
              onPress={() => s.nav && navigation.navigate(s.nav)}
              activeOpacity={s.nav ? 0.7 : 1}
            >
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: s.color }]}>{s.num ?? 0}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Status Peminjaman ────────────────────────────── */}
        <View style={styles.readingSection}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>STATUS PEMINJAMAN TERAKHIR</Text>
          </View>

          {activeLoan ? (
            <>
              <View style={styles.readingCard}>
                <View style={styles.readingCover}>
                  <View style={styles.readingSpine} />
                  <Text style={styles.readingEmoji}>📖</Text>
                </View>
                <View style={styles.readingInfo}>
                  <Text style={styles.readingTitle} numberOfLines={1}>
                    {activeLoan.book?.title}
                  </Text>
                  <Text style={styles.readingAuthor}>
                    {activeLoan.status?.toUpperCase()}
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, {
                      width:
                        activeLoan.status === 'active'  || activeLoan.status === 'overdue'  ? '100%' :
                        activeLoan.status === 'returning' ? '75%' : '40%',
                    }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {activeLoan.status === 'active'     ? 'Sedang Dipinjam'
                    : activeLoan.status === 'overdue'   ? 'Terlambat Dikembalikan'
                    : activeLoan.status === 'returning' ? 'Menunggu Konfirmasi Pengembalian'
                    : 'Menunggu Persetujuan'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => navigation.navigate('MyLoans')}
                >
                  <Text style={styles.continueBtnText}>›</Text>
                </TouchableOpacity>
              </View>

              {/* ── Return Button ────────────────────────── */}
              {(activeLoan.status === 'active' || activeLoan.status === 'overdue') && (
                <TouchableOpacity
                  style={styles.returnBtn}
                  onPress={() => setShowReturnModal(true)}
                >
                  <Ionicons name="arrow-undo-outline" size={18} color="#6366f1" />
                  <Text style={styles.returnBtnText}>Ajukan Pengembalian</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={[styles.readingCard, styles.emptyLoan]}>
              <Ionicons name="book-outline" size={24} color="#d1d5db" />
              <Text style={styles.emptyLoanText}>Tidak ada pinjaman aktif</Text>
            </View>
          )}
        </View>

        {/* ── Menu Groups ──────────────────────────────────── */}
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
                  style={[styles.menuRow, idx < group.items.length - 1 && styles.menuRowBorder]}
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

        {/* ── Logout ───────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={RED} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        {/* ── Footer ───────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>📚 Perpustakaan Digital</Text>
          <Text style={styles.footerVersion}>Versi 1.0.0</Text>
        </View>

      </Animated.View>

      {/* ── OTP Modal ────────────────────────────────────── */}
      <Modal
        visible={showVerifyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => { setShowVerifyModal(false); setOtpCode(''); }}
            >
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#f5a62315' }]}>
                <Ionicons name="mail-open-outline" size={24} color="#f5a623" />
              </View>
              <Text style={styles.modalTitle}>Verifikasi Email</Text>
              <Text style={styles.modalSub}>
                Masukkan 6 digit kode yang dikirim ke email kamu
              </Text>
            </View>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
              textAlign="center"
            />

            <TouchableOpacity
              style={[styles.verifySubmit, authLoading && { opacity: 0.7 }]}
              onPress={handleVerify}
              disabled={authLoading}
            >
              {authLoading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.verifySubmitText}>Verifikasi Sekarang</Text>
              }
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

      {/* ── Return Modal ──────────────────────────────────── */}
      <Modal
        visible={showReturnModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReturnModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setShowReturnModal(false)}
            >
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#e0e7ff' }]}>
                <Ionicons name="arrow-undo-outline" size={24} color="#6366f1" />
              </View>
              <Text style={styles.modalTitle}>Ajukan Pengembalian?</Text>
              <Text style={styles.modalSub}>
                Apakah kamu yakin ingin mengembalikan buku “{activeLoan?.book?.title}”?
                Staff akan mengkonfirmasi pengembalianmu.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.returnConfirmBtn, returnLoading && { opacity: 0.7 }]}
              onPress={async () => {
                const result = await requestReturn(activeLoan?.loans_id);
                setShowReturnModal(false);
                if (result?.success) {
                  showToast('Pengembalian berhasil diajukan!', 'success');
                  fetchProfileData();
                } else {
                  showToast(result?.message || 'Gagal mengajukan pengembalian.', 'error');
                }
              }}
              disabled={returnLoading}
            >
              {returnLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.returnConfirmText}>Ya, Kembalikan</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.returnCancelBtn}
              onPress={() => setShowReturnModal(false)}
            >
              <Text style={styles.returnCancelText}>Batal</Text>
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
  avatarRing: { width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: RED, overflow: 'hidden', backgroundColor: NAVY },
  avatar: { width: '100%', height: '100%' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,26,46,0.6)', justifyContent: 'center', alignItems: 'center' },
  cameraBtn: { position: 'absolute', bottom: 2, right: 2, backgroundColor: RED, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: NAVY },
  userName: { fontSize: 26, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', marginBottom: 6, textAlign: 'center' },
  userEmail: { fontSize: 14, color: '#94a3b8', marginBottom: 16, letterSpacing: 0.3 },
  memberBadge: { backgroundColor: 'rgba(233,69,96,0.15)', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(233,69,96,0.4)', alignItems: 'center' },
  memberText: { fontSize: 12, color: RED, fontWeight: '700', letterSpacing: 1.5 },
  verifyLink: { fontSize: 9, color: '#f5a623', fontWeight: '500', marginTop: 2, textTransform: 'uppercase' },
  statsCard: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 20, borderRadius: 16, paddingVertical: 20, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  statWrapper: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: '800', fontFamily: 'Georgia', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9ca3af', letterSpacing: 0.5, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: '#f1f5f9' },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  readingSection: { paddingHorizontal: 20, marginTop: 28 },
  readingCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  emptyLoan: { justifyContent: 'center', gap: 8, paddingVertical: 24 },
  emptyLoanText: { color: '#94a3b8', fontSize: 13 },
  readingCover: { width: 56, height: 72, backgroundColor: RED + '18', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
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
  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 4, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9f7f4' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937', letterSpacing: 0.1 },
  menuArrow: { width: 28, height: 28, backgroundColor: CREAM, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuArrowText: { fontSize: 20, color: '#9ca3af', lineHeight: 24, marginTop: -2 },
  unreadBadge: { backgroundColor: RED, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginRight: 8 },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 14, borderWidth: 2, borderColor: RED, backgroundColor: '#ffffff', gap: 10, elevation: 2 },
  logoutText: { fontSize: 15, fontWeight: '700', color: RED, letterSpacing: 0.3 },
  footer: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  footerLogo: { fontSize: 13, fontWeight: '600', color: '#9ca3af', fontFamily: 'Georgia' },
  footerVersion: { fontSize: 11, color: '#d1d5db', letterSpacing: 0.5 },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  returnBtnText: { color: '#6366f1', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 26, 46, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340 },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 },
  closeModal: { position: 'absolute', top: 12, right: 12, padding: 4 },
  returnConfirmBtn: { backgroundColor: '#6366f1', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16, width: '100%' },
  returnConfirmText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  returnCancelBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8, width: '100%' },
  returnCancelText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  otpInput: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 12, paddingVertical: 16, fontSize: 24, fontWeight: '700', color: NAVY, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20, letterSpacing: 10 },
  verifySubmit: { backgroundColor: NAVY, width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  verifySubmitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resendBtn: { marginTop: 16, padding: 8 },
  resendText: { fontSize: 13, color: '#6c63ff', fontWeight: '600' },
});