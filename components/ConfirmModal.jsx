import React from 'react';
import {
    View, Text, Modal, TouchableOpacity, StyleSheet,
    Dimensions, Platform
} from 'react-native';
import Animated, {
    useSharedValue, useAnimatedStyle,
    withSpring, withTiming, runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

/**
 * ConfirmModal — dialog konfirmasi yang cantik, menggantikan Alert.alert
 * 
 * Props:
 *   visible       : boolean
 *   icon          : string (Ionicons name)
 *   iconColor     : string
 *   title         : string
 *   message       : string
 *   confirmText   : string
 *   cancelText    : string
 *   confirmColor  : string
 *   onConfirm     : () => void
 *   onCancel      : () => void
 *   loading       : boolean
 */
const ConfirmModal = ({
    visible = false,
    icon = 'help-circle-outline',
    iconColor = '#6366f1',
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya',
    cancelText = 'Batal',
    confirmColor = '#6366f1',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    const scale = useSharedValue(0.85);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 14, stiffness: 120 });
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            scale.value = withTiming(0.85, { duration: 150 });
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.card, animatedStyle]}>
                    {/* Ikon */}
                    <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
                        <Ionicons name={icon} size={36} color={iconColor} />
                    </View>

                    {/* Judul & Pesan */}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Tombol */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onCancel}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.confirmBtn, { backgroundColor: confirmColor }, loading && { opacity: 0.6 }]}
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmText}>
                                {loading ? 'Memproses...' : confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 28,
        width: Math.min(width - 48, 380),
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
            },
            android: { elevation: 12 },
            web: { boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
        }),
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },
});

export default ConfirmModal;
