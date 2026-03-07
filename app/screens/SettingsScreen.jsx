import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useState, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const NAVY = '#1a1a2e';
const RED = '#e94560';
const CREAM = '#f9f7f4';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const SettingItem = ({ icon, label, value, onValueChange, type = 'switch', onPress, color = '#6c63ff' }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={type === 'link' ? 0.7 : 1}
      disabled={type === 'switch'}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#e2e8f0', true: RED + '40' }}
          thumbColor={value ? RED : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENSI</Text>
          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              label="Notifikasi Push"
              value={notifications}
              onValueChange={setNotifications}
              color="#e94560"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="moon-outline"
              label="Mode Gelap"
              value={darkMode}
              onValueChange={setDarkMode}
              color="#6c63ff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>KEAMANAN</Text>
          <View style={styles.card}>
            <SettingItem
              icon="finger-print-outline"
              label="Biometrik / FaceID"
              value={biometric}
              onValueChange={setBiometric}
              color="#52b788"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed-outline"
              label="Ganti Password"
              type="link"
              onPress={() => { }}
              color="#f5a623"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LAINNYA</Text>
          <View style={styles.card}>
            <SettingItem
              icon="shield-checkmark-outline"
              label="Kebijakan Privasi"
              type="link"
              onPress={() => navigation.navigate('Privacy')}
              color="#00b4d8"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="help-circle-outline"
              label="Pusat Bantuan"
              type="link"
              onPress={() => navigation.navigate('Help')}
              color="#8b5cf6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle-outline"
              label="Tentang Aplikasi"
              type="link"
              onPress={() => navigation.navigate('About')}
              color="#64748b"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={RED} />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versi 1.0.0 (Build 102)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: NAVY, fontFamily: 'Georgia' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  label: { flex: 1, fontSize: 15, fontWeight: '600', color: '#334155' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 66 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginTop: 12, paddingVertical: 16, borderRadius: 16, gap: 10, borderWidth: 1, borderColor: '#fee2e2' },
  logoutText: { fontSize: 15, fontWeight: '700', color: RED },
  version: { textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' },
});