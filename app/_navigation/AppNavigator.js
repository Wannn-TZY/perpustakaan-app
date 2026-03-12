import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// AUTH
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/Registerscreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

// MAIN
import MainTabNavigator from './MainTabNavigator';

// OTHER SCREENS
import BookDetailScreen from '../screens/BookDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import HelpScreen from '../screens/HelpScreen';
import AboutScreen from '../screens/AboutScreen';
import MyLoansScreen from '../screens/MyLoansScreen';
import ReaderDetailScreen from '../screens/ReaderDetailScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',

        // 🔥 TRANSISI GLOBAL
        animation: 'slide_from_right', // default Android style
        animationDuration: 250,

        // gesture swipe back (iOS feel)
        gestureEnabled: true,
      }}
    >
      {user ? (
        <>
          {/* TAB UTAMA */}
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{
              headerShown: false,
              animation: 'fade', // beda animasi buat tab utama
            }}
          />

          {/* GLOBAL SCREENS */}
          <Stack.Screen
            name="BookDetail"
            component={BookDetailScreen}
            options={{
              title: 'Detail Buku',
              animation: 'slide_from_bottom', // 🔥 naik dari bawah
            }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              title: 'Edit Profil',
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Pengaturan',
              animation: 'fade',
            }}
          />

          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
              title: 'Notifikasi',
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="Privacy"
            component={PrivacyScreen}
            options={{
              title: 'Privasi & Keamanan',
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              title: 'Bantuan',
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              title: 'Tentang Aplikasi',
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="MyLoans"
            component={MyLoansScreen}
            options={{
              title: 'Pinjaman Saya',
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="ReaderDetail"
            component={ReaderDetailScreen}
            options={{
              title: 'Membaca Buku',
              headerShown: true,
              animation: 'slide_from_bottom',
            }}
          />
        </>
      ) : (

        <>
          {/* LOGIN & REGISTER STACK */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              animation: 'fade', // login enak pake fade
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}