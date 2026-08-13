import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PlaceholderScreen from '../screens/PlaceholderScreen';
// Swap these in as each real screen gets built:
// import HomeFeedScreen from '../screens/HomeFeedScreen';
// import SearchScreen from '../screens/SearchScreen';
// import CreatePostScreen from '../screens/CreatePostScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeFeed: 'home',
  Search: 'search',
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
      <Tab.Screen name="HomeFeed" component={PlaceholderScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={PlaceholderScreen} />
      <Tab.Screen name="CreatePost" component={PlaceholderScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}
