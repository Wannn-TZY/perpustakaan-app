import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const ROLES = [
  { value: 'public', label: 'Publik', desc: 'Akses baca terbatas', icon: 'earth-outline', accent: '#00b4d8' },
  { value: 'member', label: 'Member', desc: 'Akses penuh & pinjam', icon: 'person-outline', accent: '#52b788' },
];

const fieldsData = [
  { key: 'name', label: 'NAMA LENGKAP', placeholder: 'Nama lengkap kamu', icon: 'person-outline', accent: '#6c63ff', keyboard: 'default' },
  { key: 'email', label: 'EMAIL', placeholder: 'nama@email.com', icon: 'mail-outline', accent: '#00b4d8', keyboard: 'email-address' },
  { key: 'phone', label: 'NO. TELEPON', placeholder: '08xxxxxxxxxx (opsional)', icon: 'call-outline', accent: '#f5a623', keyboard: 'phone-pad' },
  { key: 'password', label: 'PASSWORD', placeholder: 'Minimal 8 karakter', icon: 'lock-closed-outline', accent: RED, keyboard: 'default', secure: true },
  { key: 'confirm', label: 'KONFIRMASI', placeholder: 'Ulangi password', icon: 'shield-checkmark-outline', accent: '#52b788', keyboard: 'default', secure: true },
];

export default function RegisterScreen({ navigation }) {
  const { showToast } = useToast();
  const { register, loading, error, setError, fieldErrors, setFieldErrors } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [role, setRole] = useState('member');
  const [showPw, setShowPw] = useState({ password: false, confirm: false });
  const [focused, setFocused] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi.';
    if (!form.email.trim()) errs.email = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid.';
    if (form.password.length < 8) errs.password = 'Password minimal 8 karakter.';
    if (form.password !== form.confirm) errs.confirm = 'Password tidak cocok.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const pwStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Lemah', color: RED, bars: 1 };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Sedang', color: '#f5a623', bars: 2 };
    return { label: 'Kuat', color: '#52b788', bars: 4 };
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      password: form.password,
      role,
    });

    if (result && result.success) {
      showToast("Registrasi Berhasil! Silakan cek email kamu untuk kode verifikasi.", "success");
      setTimeout(() => navigation.navigate('Login'), 2000);
    }
  };

  const strength = pwStrength();
  const isFormValid = form.name && form.email && form.password && form.confirm;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />

        <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoWrap}>
            <View style={styles.logoInner}>
              <Text style={styles.logoEmoji}>📚</Text>
            </View>
          </View>
          <Text style={styles.appName}>Bacabuku</Text>
          <View style={styles.appBadge}>
            <Text style={styles.appBadgeText}>✦ DAFTAR AKUN BARU</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Buat Akun</Text>
            <Text style={styles.cardSub}>Bergabung dan mulai jelajahi ribuan buku</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={RED} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>DAFTAR SEBAGAI</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.roleCard, role === r.value && { borderColor: r.accent, borderWidth: 2 }]}
                  onPress={() => setRole(r.value)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.roleIcon, { backgroundColor: r.accent + '18' }]}>
                    <Ionicons name={r.icon} size={20} color={r.accent} />
                  </View>
                  <Text style={[styles.roleLabel, role === r.value && { color: r.accent }]}>{r.label}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                  {role === r.value && (
                    <View style={[styles.roleCheck, { backgroundColor: r.accent }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {fieldsData.map((field) => (
            <View key={field.key}>
              <Input
                label={field.label}
                icon={field.icon}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={(v) => {
                  setForm((f) => ({ ...f, [field.key]: v }));
                  setFieldErrors((e) => ({ ...e, [field.key]: '' }));
                  setError('');
                }}
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
                keyboardType={field.keyboard}
                secureTextEntry={field.secure && !showPw[field.key]}
                showPasswordToggle={field.secure}
                showPassword={showPw[field.key]}
                onPasswordToggle={() => setShowPw(s => ({ ...s, [field.key]: !s[field.key] }))}
                focused={focused === field.key}
                error={fieldErrors[field.key]}
                onClear={!field.secure ? () => setForm(f => ({ ...f, [field.key]: '' })) : undefined}
              />
              {field.key === 'password' && strength && (
                <View style={styles.strengthWrap}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.strengthBar,
                          i <= strength.bars && { backgroundColor: strength.color },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
            </View>
          ))}

          <Button
            title="Daftar Sekarang"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid}
            icon="person-add-outline"
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>📚 Bacabuku  •  © 2025</Text>
          <Text style={styles.footerSub}>Perpustakaan Digital Indonesia</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NAVY },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  bgCircle1: { position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: RED, opacity: 0.07 },
  bgCircle2: { position: 'absolute', top: 40, left: -100, width: 220, height: 220, borderRadius: 110, backgroundColor: '#6c63ff', opacity: 0.06 },
  bgCircle3: { position: 'absolute', top: 200, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: '#52b788', opacity: 0.05 },
  logoSection: { alignItems: 'center', paddingTop: 56, paddingBottom: 28 },
  logoWrap: { width: 80, height: 80, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  logoInner: { width: 60, height: 60, borderRadius: 16, backgroundColor: RED, justifyContent: 'center', alignItems: 'center' },
  logoEmoji: { fontSize: 28 },
  appName: { fontSize: 28, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', marginBottom: 10 },
  appBadge: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, borderLeftWidth: 3, borderLeftColor: RED },
  appBadgeText: { fontSize: 10, color: '#e2e8f0', letterSpacing: 2.5, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  cardHeader: { marginBottom: 20 },
  cardTitle: { fontSize: 24, fontWeight: '800', color: NAVY, fontFamily: 'Georgia', marginBottom: 6 },
  cardSub: { fontSize: 13, color: '#9ca3af', letterSpacing: 0.2 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: RED + '12', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 16, borderWidth: 1, borderColor: RED + '30', gap: 8 },
  errorText: { flex: 1, fontSize: 13, color: RED, fontWeight: '500', lineHeight: 18 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleCard: { flex: 1, backgroundColor: CREAM, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', position: 'relative' },
  roleIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  roleLabel: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 3 },
  roleDesc: { fontSize: 10, color: '#9ca3af', textAlign: 'center', letterSpacing: 0.2, lineHeight: 14 },
  roleCheck: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  fieldWrapper: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 1.5, marginBottom: 8 },
  strengthWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 16 },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb' },
  strengthLabel: { fontSize: 11, fontWeight: '700', minWidth: 40, textAlign: 'right' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  loginText: { fontSize: 13, color: '#9ca3af' },
  loginLink: { fontSize: 13, fontWeight: '700', color: '#6c63ff' },
  footer: { alignItems: 'center', paddingTop: 28, gap: 6 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: '500' },
  footerSub: { fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: 0.3 },
});