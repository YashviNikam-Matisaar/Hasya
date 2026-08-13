import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ProfileStack from './ProfileStack';
import CreatePostStack from './CreatePostStack';
import HomeFeedScreen from '../screens/HomeFeedScreen';

const Tab = createBottomTabNavigator();

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeFeed: 'home',
  CreatePost: 'add-circle',
  Profile: 'person',
};

export default function MainTabs() {
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
      })}
    >
      <Tab.Screen name="HomeFeed" component={HomeFeedScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="CreatePost" component={CreatePostStack} options={{ title: 'Create' }} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
