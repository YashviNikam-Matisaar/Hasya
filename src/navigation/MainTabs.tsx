import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

import { colors } from '../theme/colors';
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
        tabBarActiveTintColor: colors.rust,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconMap[route.name] ?? 'ellipse'} size={size} color={color} />
        ),
        // ✅ Add this to ensure icons don't get weirdly spaced out if there are only 2 tabs
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