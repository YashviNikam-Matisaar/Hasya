import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const items: { icon: any; iconBg: string; title: string; desc: string }[] = [
  { icon: 'arrow-up', iconBg: '#4CAF50', title: 'Swipe Up', desc: 'Like the joke & next' },
  { icon: 'arrow-down', iconBg: colors.coral, title: 'Swipe Down', desc: 'Save the joke & next' },
  { icon: 'arrow-forward', iconBg: '#F5A623', title: 'Swipe Right', desc: 'Skip to next joke' },
  { icon: 'arrow-back', iconBg: '#3E7CB1', title: 'Swipe Left', desc: 'Go to previous joke' },
];

export default function GestureTooltipOverlay({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>How to use Hasya</Text>
          {items.map((item) => (
            <View key={item.title} style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={18} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.primaryDark, borderRadius: 20, padding: 24, width: '100%' },
  title: { fontSize: 20, fontWeight: '700', color: colors.white, marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: colors.white, fontWeight: '700', fontSize: 15 },
  rowDesc: { color: colors.primary, fontSize: 13, marginTop: 2 },
  button: { backgroundColor: colors.rust, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
