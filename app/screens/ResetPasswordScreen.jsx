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
    Alert,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NAVY = '#1a1a2e';
const RED = '#e94560';

export default function ResetPasswordScreen({ navigation, route }) {
    const { showToast } = useToast();
    const { email } = route.params || {};
    const { resetPassword, loading, error, setError, fieldErrors, setFieldErrors } = useAuth();

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleResetPassword = async () => {
        if (!token || !password || !confirmPassword) {
            setError('Semua field wajib diisi.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Password konfirmasi tidak cocok.');
            return;
        }

        const success = await resetPassword({
            email,
            token,
            password,
            password_confirmation: confirmPassword,
        });

        if (success) {
            showToast('Password Anda telah berhasil direset.', 'success');
            setTimeout(() => navigation.navigate('Login'), 2000);
        }
    };

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

                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.logoWrap}>
                        <View style={styles.logoInner}>
                            <Text style={styles.logoEmoji}>🛡️</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Masukkan token 6-digit yang dikirim ke {email} dan tentukan password baru kamu.</Text>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {error ? (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle-outline" size={16} color={RED} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Input
                        label="TOKEN RESET (6 DIGIT)"
                        icon="key-outline"
                        placeholder="Contoh: 123456"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={token}
                        onChangeText={(v) => { setToken(v); setError(''); }}
                        onFocus={() => setFocused('token')}
                        onBlur={() => setFocused(null)}
                        focused={focused === 'token'}
                    />

                    <Input
                        label="PASSWORD BARU"
                        icon="lock-closed-outline"
                        placeholder="Minimal 8 karakter"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(v) => { setPassword(v); setError(''); setFieldErrors({}); }}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        focused={focused === 'password'}
                        showPasswordToggle
                        showPassword={showPassword}
                        onPasswordToggle={() => setShowPassword(!showPassword)}
                        error={fieldErrors.password}
                    />

                    <Input
                        label="KONFIRMASI PASSWORD"
                        icon="shield-checkmark-outline"
                        placeholder="Ulangi password baru"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={(v) => { setConfirmPassword(v); setError(''); }}
                        onFocus={() => setFocused('confirm')}
                        onBlur={() => setFocused(null)}
                        focused={focused === 'confirm'}
                    />

                    <Button
                        title="Reset Password"
                        onPress={handleResetPassword}
                        loading={loading}
                        disabled={!token || password.length < 8 || !confirmPassword}
                        icon="checkmark-circle-outline"
                    />
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
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
    backBtn: { alignSelf: 'flex-start', marginBottom: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    logoWrap: { width: 80, height: 80, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
    logoInner: { width: 60, height: 60, borderRadius: 16, backgroundColor: RED, justifyContent: 'center', alignItems: 'center' },
    logoEmoji: { fontSize: 28 },
    title: { fontSize: 26, fontWeight: '800', color: '#ffffff', fontFamily: 'Georgia', marginBottom: 10 },
    subtitle: { fontSize: 13, color: '#9ca3af', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
    card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
    errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: RED + '12', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 16, borderWidth: 1, borderColor: RED + '30', gap: 8 },
    errorText: { flex: 1, fontSize: 13, color: RED, fontWeight: '500', lineHeight: 18 },
});
