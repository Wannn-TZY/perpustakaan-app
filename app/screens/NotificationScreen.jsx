import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationScreen() {
  const { notifications, loading, fetchNotifications, markAsRead, deleteNotification } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Hapus Notifikasi',
      'Apakah Anda yakin ingin menghapus notifikasi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteNotification(id) }
      ]
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#1a1a2e" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notifications_id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, item.is_read && styles.readCard]}
            onPress={() => !item.is_read && markAsRead(item.notifications_id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, item.is_read && styles.readIconContainer]}>
              <Ionicons name={item.is_read ? "notifications-outline" : "notifications"} size={20} color={item.is_read ? "#94a3b8" : "#e94560"} />
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={[styles.notifTitle, item.is_read && styles.readTitle]}>{item.title || 'Pemberitahuan'}</Text>
                {item.created_at && <Text style={styles.timeText}>{new Date(item.created_at).toLocaleDateString('id-ID')}</Text>}
              </View>
              <Text style={[styles.notifBody, item.is_read && styles.readBody]} numberOfLines={2}>{item.message || item.data?.message}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.notifications_id)}><Ionicons name="trash-outline" size={18} color="#cbd5e1" /></TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Ionicons name="notifications-off-outline" size={48} color="#9ca3af" /><Text style={styles.emptyText}>Tidak ada notifikasi baru 🔔</Text></View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f7f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notifCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 12, elevation: 2 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff1f2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  notifBody: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  readCard: { backgroundColor: '#fcfcfc', opacity: 0.8 },
  readIconContainer: { backgroundColor: '#f1f5f9' },
  readTitle: { color: '#64748b', fontWeight: '600' },
  readBody: { color: '#94a3af' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 11, color: '#94a3af' },
  deleteBtn: { padding: 8, alignSelf: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, color: '#9ca3af', fontSize: 15 },
});
