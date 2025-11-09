import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TasbeehCounter from '@/components/TasbeehCounter';
import { COLORS } from '@/constants/theme';

export default function AstaghfarScreen() {
  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TasbeehCounter
          storageKey="astaghfar_record"
          arabicText="أَسْتَغْفِرُ اللَّهَ رَبِّي مِن كُلِّ ذَنبٍ وَأَتُوبُ إِلَيْهِ"
          urduNote="روزانہ صبح و شام سو مرتبہ استغفار پڑھیں۔"
          goal={100}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
