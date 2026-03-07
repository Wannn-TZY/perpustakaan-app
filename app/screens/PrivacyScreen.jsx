import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useState, useRef, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const devices = [
  { id: 1, name: 'iPhone 13 Pro', location: 'Jakarta, Indonesia', time: 'Aktif sekarang', icon: 'phone-portrait-outline', current: true },
  { id: 2, name: 'Chrome — Windows', location: 'Depok, Indonesia', time: '2 jam lalu', icon: 'laptop-outline', current: false },
  { id: 3, name: 'Firefox — MacBook', location: 'Bandung, Indonesia', time: '3 hari lalu', icon: 'desktop-outline', current: false },
];

export default function PrivacyScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { loading, changePassword, resendVerification, deleteAccount } = useAuth();

  const [emailVerified, setEmailVerified] = useState(user?.email_verified_at !== null);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [focused, setFocused] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEmailVerified(user?.email_verified_at !== null);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [user]);

  const handleSavePassword = async () => {
    if (!pwForm.old || !pwForm.new || !pwForm.confirm) {
      Alert.alert('Error', 'Harap isi semua field');
      return;
    }
    const success = await changePassword({
      current_password: pwForm.old,
      new_password: pwForm.new,
      new_password_confirmation: pwForm.confirm,
    });

    if (success) {
      setSaved(true);
      setPwForm({ old: '', new: '', confirm: '' });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hapus Akun',
      'Apakah Anda yakin ingin menghapus akun ini secara permanen?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: deleteAccount }
      ]
    );
  };

  const pwFields = [
    { key: 'old', label: 'Password Lama', placeholder: 'Masukkan password lama', accent: '#6c63ff' },
    { key: 'new', label: 'Password Baru', placeholder: 'Minimal 8 karakter', accent: RED },
    { key: 'confirm', label: 'Konfirmasi Password', placeholder: 'Ulangi password baru', accent: '#52b788' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color="#94a3b8" /></TouchableOpacity>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>🔒 PRIVASI & KEAMANAN</Text></View>
          <Text style={styles.heroTitle}>Jaga Keamanan{'\n'}Akunmu.</Text>
          <Text style={styles.heroSub}>Kelola password dan perangkat yang terhubung ke akunmu.</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}><View style={styles.sectionAccent} /><Text style={styles.sectionTitle}>VERIFIKASI EMAIL</Text></View>
            <View style={styles.card}>
              <View style={[styles.verifyIcon, { backgroundColor: emailVerified ? '#52b788' + '18' : RED + '18' }]}><Ionicons name={emailVerified ? 'shield-checkmark' : 'shield-outline'} size={28} color={emailVerified ? '#52b788' : RED} /></View>
              <View style={styles.verifyInfo}>
                <Text style={styles.verifyTitle}>{emailVerified ? 'Email Terverifikasi' : 'Email Belum Terverifikasi'}</Text>
                <Text style={styles.verifyEmail}>{user?.email || 'user@example.com'}</Text>
                <Text style={styles.verifyNote}>{emailVerified ? 'Akunmu sudah aman dan terverifikasi.' : 'Verifikasi email untuk keamanan penuh.'}</Text>
              </View>
              {!emailVerified && <TouchableOpacity style={styles.verifyBtn} onPress={resendVerification} disabled={loading}><Text style={styles.verifyBtnText}>{loading ? '...' : 'Kirim'}</Text></TouchableOpacity>}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionLabelRow}><View style={styles.sectionAccent} /><Text style={styles.sectionTitle}>UBAH PASSWORD</Text></View>
            <View style={styles.card}>
              {pwFields.map((field) => (
                <View key={field.key} style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={[styles.inputBox, focused === field.key && { borderColor: field.accent, borderWidth: 2 }]}>
                    <View style={[styles.inputIcon, { backgroundColor: field.accent + '18' }]}><Ionicons name="lock-closed-outline" size={17} color={focused === field.key ? field.accent : '#9ca3af'} /></View>
                    <TextInput style={styles.input} placeholder={field.placeholder} placeholderTextColor="#c4c9d4" secureTextEntry={!showPassword[field.key]} value={pwForm[field.key]} onChangeText={(v) => setPwForm((f) => ({ ...f, [field.key]: v }))} onFocus={() => setFocused(field.key)} onBlur={() => setFocused(null)} />
                    <TouchableOpacity onPress={() => setShowPassword((s) => ({ ...s, [field.key]: !s[field.key] }))}><Ionicons name={showPassword[field.key] ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9ca3af" /></TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnSuccess]} onPress={handleSavePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : saved ? <><Ionicons name="checkmark-circle" size={18} color="#fff" /><Text style={styles.saveBtnText}>Password Diperbarui!</Text></> : <><Ionicons name="lock-closed" size={18} color="#fff" /><Text style={styles.saveBtnText}>Simpan Password</Text></>}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionLabelRow}><View style={styles.sectionAccent} /><Text style={styles.sectionTitle}>ZONA BERBAHAYA</Text></View>
            <View style={[styles.card, { borderColor: RED + '33' }]}>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                <View style={[styles.deleteIcon, { backgroundColor: RED + '12' }]}><Ionicons name="trash-outline" size={20} color={RED} /></View>
                <View style={{ flex: 1 }}><Text style={styles.deleteTitle}>Hapus Akun</Text><Text style={styles.deleteSub}>Hapus data Anda secara permanen</Text></View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  hero: { backgroundColor: NAVY, paddingTop: 52, paddingBottom: 36, paddingHorizontal: 24 },
  backBtn: { marginBottom: 20, width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: RED },
  heroBadgeText: { fontSize: 11, color: '#e2e8f0', letterSpacing: 2, fontWeight: '600' },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', lineHeight: 42, marginBottom: 10 },
  heroSub: { fontSize: 14, color: '#94a3b8', lineHeight: 21 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 2.5 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  verifyIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  verifyInfo: { flex: 1 },
  verifyTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Georgia', marginBottom: 2 },
  verifyEmail: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  verifyNote: { fontSize: 12, color: '#9ca3af', lineHeight: 18 },
  verifyBtn: { backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', marginTop: 8 },
  verifyBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  fieldWrapper: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: CREAM, borderRadius: 12, borderWidth: 1.5, borderColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 11 },
  inputIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, borderRadius: 12, paddingVertical: 15, gap: 8, marginTop: 4, elevation: 4 },
  saveBtnSuccess: { backgroundColor: '#52b788' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  deleteIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  deleteTitle: { fontSize: 14, fontWeight: '700', color: RED },
  deleteSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
});
