// components/ui/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NAVY = '#1a1a2e';

const Button = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary', // 'primary', 'secondary', 'outline'
    icon,
    style,
    textStyle,
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.btn,
                isPrimary && styles.btnPrimary,
                isOutline && styles.btnOutline,
                (disabled || loading) && styles.btnDisabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
        >
            {loading ? (
                <View style={styles.row}>
                    <ActivityIndicator color={isOutline ? NAVY : '#fff'} size="small" />
                    <Text style={[styles.btnText, isOutline && styles.textOutline, textStyle]}>Memproses...</Text>
                </View>
            ) : (
                <View style={styles.row}>
                    {icon && <Ionicons name={icon} size={20} color={isOutline ? NAVY : '#fff'} />}
                    <Text style={[styles.btnText, isOutline && styles.textOutline, textStyle]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    btnPrimary: {
        backgroundColor: NAVY,
        shadowColor: NAVY,
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: NAVY,
        elevation: 0,
        shadowOpacity: 0,
    },
    btnDisabled: {
        opacity: 0.45,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.3,
    },
    textOutline: {
        color: NAVY,
    },
});

export default Button;
