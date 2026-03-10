import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const Toast = ({ message, type = 'success', onHide }) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    const getTheme = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'rgba(236, 253, 245, 0.9)',
                    border: '#10b981',
                    icon: 'checkmark-circle',
                    color: '#065f46',
                    haptic: Haptics.NotificationFeedbackType.Success
                };
            case 'error':
                return {
                    bg: 'rgba(254, 242, 242, 0.9)',
                    border: '#ef4444',
                    icon: 'alert-circle',
                    color: '#991b1b',
                    haptic: Haptics.NotificationFeedbackType.Error
                };
            case 'warning':
                return {
                    bg: 'rgba(255, 251, 235, 0.9)',
                    border: '#f59e0b',
                    icon: 'warning',
                    color: '#92400e',
                    haptic: Haptics.NotificationFeedbackType.Warning
                };
            default:
                return {
                    bg: 'rgba(239, 246, 255, 0.9)',
                    border: '#3b82f6',
                    icon: 'information-circle',
                    color: '#1e40af',
                    haptic: null
                };
        }
    };

    const theme = getTheme();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const hide = () => {
        translateY.value = withTiming(-100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(onHide)();
            }
        });
    };

    useEffect(() => {
        // Show animation
        translateY.value = withSpring(Platform.OS === 'ios' ? 60 : 40, {
            damping: 12,
            stiffness: 100,
        });
        opacity.value = withTiming(1, { duration: 300 });

        // Haptic feedback
        if (theme.haptic) {
            Haptics.notificationAsync(theme.haptic);
        }

        // Auto hide after 3.5s
        const timer = setTimeout(hide, 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[styles.container, animatedStyle, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <View style={styles.content}>
                <Ionicons name={theme.icon} size={24} color={theme.border} style={styles.icon} />
                <Text style={[styles.text, { color: theme.color }]}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
            },
        }),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        lineHeight: 20,
    },
});

export default Toast;
