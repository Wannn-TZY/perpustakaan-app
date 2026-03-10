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
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NAVY = '#1a1a2e';
const RED = '#e94560';

export default function LoginScreen({ navigation }) {
  const { login, loading, error, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    await login(email, password);
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

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
        {/* ── Background Decoration ──────────────────────────── */}
        <View style={styles.bgTop} />
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        {/* ── Logo & Branding ────────────────────────────────── */}
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoWrap}>
            <View style={styles.logoInner}>
              <Text style={styles.logoEmoji}>📚</Text>
            </View>
          </View>
          <Text style={styles.appName}>Bacabuku</Text>
          <View style={styles.appBadge}>
            <Text style={styles.appBadgeText}>✦ PERPUSTAKAAN DIGITAL</Text>
          </View>
        </Animated.View>

        {/* ── Form Card ──────────────────────────────────────── */}
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Masuk ke Akun</Text>
            <Text style={styles.cardSub}>Gunakan email yang terdaftar di sistem</Text>
          </View>

          {/* Error Banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={RED} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email Field */}
          <Input
            label="EMAIL"
            icon="mail-outline"
            placeholder="nama@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(''); }}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            onClear={() => setEmail('')}
            focused={focused === 'email'}
          />

          {/* Password Field */}
          <Input
            label="PASSWORD"
            icon="lock-closed-outline"
            placeholder="Masukkan password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(v) => { setPassword(v); setError(''); }}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            focused={focused === 'password'}
            showPasswordToggle
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword(!showPassword)}
            onSubmitEditing={handleLogin}
            rightElement={
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Lupa?</Text>
              </TouchableOpacity>
            }
          />

          {/* Login Button */}
          <Button
            title="Masuk"
            onPress={handleLogin}
            loading={loading}
            disabled={!isFormValid}
            icon="log-in-outline"
          />

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.registerLink}>Daftar di sini</Text>
            </TouchableOpacity>
          </View>



        </Animated.View>

        {/* ── Footer ─────────────────────────────────────────── */}
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

  // ── BG Decoration
  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 300,
    backgroundColor: NAVY,
  },
  bgCircle1: {
    position: 'absolute',
    top: -80, right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: RED,
    opacity: 0.07,
  },
  bgCircle2: {
    position: 'absolute',
    top: 40, left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#6c63ff',
    opacity: 0.06,
  },

  // ── Logo
  logoSection: { alignItems: 'center', paddingTop: 64, paddingBottom: 36 },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.07)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoInner: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Georgia',
    marginBottom: 10,
  },
  appBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: RED,
  },
  appBadgeText: { fontSize: 10, color: '#e2e8f0', letterSpacing: 2.5, fontWeight: '700' },

  // ── Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  cardHeader: { marginBottom: 20 },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: NAVY,
    fontFamily: 'Georgia',
    marginBottom: 6,
  },
  cardSub: { fontSize: 13, color: '#9ca3af', letterSpacing: 0.2 },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED + '12',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: RED + '30',
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 13, color: RED, fontWeight: '500', lineHeight: 18 },

  forgotBtn: { marginLeft: 10 },
  forgotText: { fontSize: 12, color: '#6c63ff', fontWeight: '600' },

  // Register link
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  registerText: { fontSize: 13, color: '#9ca3af' },
  registerLink: { fontSize: 13, fontWeight: '700', color: '#6c63ff' },



  // Footer
  footer: { alignItems: 'center', paddingTop: 32, gap: 6 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: '500' },
  footerSub: { fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: 0.3 },
});