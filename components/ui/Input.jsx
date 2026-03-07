// components/ui/Input.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CREAM = '#f9f7f4';

const Input = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    showPasswordToggle,
    showPassword,
    onPasswordToggle,
    focused,
    onFocus,
    onBlur,
    onClear,
    rightElement,
    ...props
}) => {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
            <View style={[styles.inputBox, focused && styles.inputFocused, error && styles.inputError]}>
                {icon && (
                    <View style={[styles.inputIcon, focused && styles.inputIconActive]}>
                        <Ionicons
                            name={icon}
                            size={18}
                            color={focused ? '#6c63ff' : '#9ca3af'}
                        />
                    </View>
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#c4c9d4"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...props}
                />
                {onClear && value.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close-circle" size={18} color="#d1d5db" />
                    </TouchableOpacity>
                )}
                {showPasswordToggle && (
                    <TouchableOpacity onPress={onPasswordToggle}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={18}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>
                )}
                {rightElement}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: 18 },
    label: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 1.5, marginBottom: 8 },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CREAM,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
    },
    inputFocused: { borderColor: '#6c63ff', borderWidth: 2, backgroundColor: '#ffffff' },
    inputError: { borderColor: '#e94560' },
    inputIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIconActive: { backgroundColor: '#6c63ff18' },
    input: { flex: 1, fontSize: 15, color: '#111827', letterSpacing: 0.1 },
    errorText: { color: '#e94560', fontSize: 12, marginTop: 4, fontWeight: '500' },
});

export default Input;
