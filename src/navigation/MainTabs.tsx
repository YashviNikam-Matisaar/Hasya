import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

// ✅ Remove colors import, add useTheme import
import { useTheme } from '../context/ThemeContext'; 
import { useAuth } from '../hooks/useAuth';

import ProfileStack from './ProfileStack';
import CreatePostStack from './CreatePostStack';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeFeed: 'home',
  CreatePost: 'add-circle',
  Profile: 'person',
};

export default function MainTabs() {
  const { session } = useAuth();
  const { theme } = useTheme(); // ✅ Get the dynamic theme

  const handleProfilePress = () => {
    if (!session) {
      Alert.alert(
        'Login Required',
        'Please log in or sign up to view your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => console.log('Navigate to Login') }
        ]
      );
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // ✅ Replace colors with theme
        tabBarActiveTintColor: theme.rust,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconMap[route.name] ?? 'ellipse'} size={size} color={color} />
        ),
        tabBarLabel: route.name === 'CreatePost' ? 'Create' : route.name === 'HomeFeed' ? 'Home' : 'Profile',
      })}
    >
      <Tab.Screen name="HomeFeed" component={HomeStack} />
      
      {session && (
        <Tab.Screen name="CreatePost" component={CreatePostStack} />
      )}

      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        listeners={{
          tabPress: (e) => {
            if (!session) {
              e.preventDefault();
              handleProfilePress();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}