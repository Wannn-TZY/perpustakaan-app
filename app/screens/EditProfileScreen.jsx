import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../hooks/useProfile';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

const fieldsData = [
  {
    key: 'name',
    label: 'Nama Lengkap',
    placeholder: 'Masukkan nama lengkap',
    icon: 'person-outline',
    accent: '#6c63ff',
    keyboardType: 'default',
  },
  {
    key: 'email',
    label: 'Alamat Email',
    placeholder: 'Masukkan email',
    icon: 'mail-outline',
    accent: '#00b4d8',
    keyboardType: 'email-address',
    editable: false,
  },
  {
    key: 'phone',
    label: 'Nomor Telepon',
    placeholder: 'Masukkan nomor telepon',
    icon: 'call-outline',
    accent: '#52b788',
    keyboardType: 'phone-pad',
  },
];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { user, loading, updateProfileData } = useProfile();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [focused, setFocused] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleSave = async () => {
    const success = await updateProfileData({
      name: form.name,
      phone: form.phone,
    });

    if (success) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigation.goBack();
      }, 1200);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✦ EDIT PROFIL</Text>
          </View>
          <Text style={styles.heroTitle}>Perbarui{'\n'}Informasimu.</Text>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
              <Image
                source={{
                  uri: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || 'User'
                  )}&size=200&background=e94560&color=fff&bold=true`,
                }}
                style={styles.avatar}
              />
            </View>
          </View>
        </View>

        {/* ── Form ───────────────────────────────────────────── */}
        <Animated.View style={[styles.formSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>INFORMASI AKUN</Text>
          </View>

          {fieldsData.map((field) => (
            <Input
              key={field.key}
              label={field.label}
              icon={field.icon}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChangeText={(val) => setForm((f) => ({ ...f, [field.key]: val }))}
              onFocus={() => setFocused(field.key)}
              onBlur={() => setFocused(null)}
              keyboardType={field.keyboardType}
              editable={field.editable !== false}
              focused={focused === field.key}
              style={focused === field.key ? { borderColor: field.accent, borderWidth: 2 } : {}}
            />
          ))}
        </Animated.View>

        {/* ── Save Button ────────────────────────────────────── */}
        <View style={styles.btnSection}>
          <Button
            title={saved ? "Tersimpan!" : "Simpan Perubahan"}
            onPress={handleSave}
            loading={loading}
            icon={saved ? "checkmark-circle" : "save-outline"}
            style={saved ? { backgroundColor: '#52b788' } : {}}
          />

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: RED,
  },
  heroBadgeText: {
    fontSize: 11,
    color: '#e2e8f0',
    letterSpacing: 2,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Georgia',
    lineHeight: 42,
    marginBottom: 28,
  },
  avatarWrapper: { position: 'relative', alignSelf: 'center', marginBottom: 12 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: RED,
    padding: 3,
  },
  avatar: { width: 86, height: 86, borderRadius: 43 },

  // ── Form
  formSection: { paddingHorizontal: 20, paddingTop: 28 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionAccent: { width: 4, height: 14, backgroundColor: RED, borderRadius: 2, marginRight: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2.5,
  },

  // ── Buttons
  btnSection: { paddingHorizontal: 20, marginTop: 32, gap: 12 },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.2,
  },
});