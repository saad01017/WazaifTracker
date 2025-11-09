import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import TasbeehCounter from '@/components/TasbeehCounter';
import { COLORS, SPACING } from '@/constants/theme';

export default function TasbeehCounterScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id, arabicText, name, goal } = params as { id: string; arabicText: string; name: string; goal: string };

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.darkGreen} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TasbeehCounter
          storageKey={id}
          arabicText={arabicText}
          urduNote={`روزانہ ${goal} مرتبہ ${name} پڑھیں۔`}
          goal={parseInt(goal)}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
});
