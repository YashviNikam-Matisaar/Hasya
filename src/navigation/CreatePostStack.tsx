import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TemplatePickerScreen from '../screens/TemplatePickerScreen';
import WriteJokeScreen from '../screens/WriteJokeScreen';
import PreviewPostScreen from '../screens/PreviewPostScreen';
import MyDraftsScreen from '../screens/MyDraftsScreen';

const Stack = createNativeStackNavigator();

export default function CreatePostStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChooseTemplate" component={TemplatePickerScreen} />
      <Stack.Screen name="WriteJoke" component={WriteJokeScreen} />
      <Stack.Screen name="PreviewPost" component={PreviewPostScreen} />
      <Stack.Screen name="MyDrafts" component={MyDraftsScreen} />
    </Stack.Navigator>
  );
}
