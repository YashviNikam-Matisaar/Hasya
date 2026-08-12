import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { supabase } from './src/lib/supabase';

export default function App() {
  useEffect(() => {
  supabase.from('templates').select('*').then(({ data, error }) => {
    console.log('Templates:', data, 'Error:', error);
  });
}, [])
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
