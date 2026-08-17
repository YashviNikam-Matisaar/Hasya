import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordscreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['hasya://'],
  config: {
    screens: {
      Welcome: 'welcome',
      Login: 'login',
      Signup: 'signup',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      MainTabs: {
        path: 'app',
        screens: {
          Home: 'feed',
          Profile: 'profile',
        },
      },
    },
  },
};

export default function RootNavigator() {
  const { session, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.rust} />
      </View>
    );
  }

  // 💡 CRITICAL FIX: Use a 'key' prop on NavigationContainer.
  // When session changes (login/logout), this forces the entire navigation tree 
  // to completely reset, preventing crashes and freezes.
  return (
    <NavigationContainer key={session ? 'loggedIn' : 'loggedOut'} linking={linking}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        // 💡 We only set the starting screen here. The stack is static, not conditional.
        initialRouteName={session ? 'MainTabs' : 'Welcome'}
      >
        {/* 
          We register ALL screens in a single stack. 
          This guarantees that `navigation.getParent()` will ALWAYS find 'Welcome'.
        */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}