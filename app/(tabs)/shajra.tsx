import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Switch, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function ShajraScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const images = [
    require('@/assets/images/shajra1.jpg'),
    require('@/assets/images/shajra2.jpg'),
    require('@/assets/images/shajra3.jpg'),
    require('@/assets/images/shajra4.jpg'),
    require('@/assets/images/shajra5.jpg'),
    require('@/assets/images/shajra6.jpg'),
    require('@/assets/images/shajra7.jpg'),
    require('@/assets/images/shajra8.jpg'),
    require('@/assets/images/shajra9.jpg'),
  ];

  // 🎧 Play audio (mobile)
  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        require('@/assets/audio/shajraAudio.m4a'),
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>شجرہ طیبہ</Text>
          <Text style={styles.subtitle}>سلسلہ عالیہ نقشبندیہ مجددیہ</Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.note}>شجرہ طیبہ کی تلاوت روزانہ دل کی توجہ سے کریں۔</Text>
        </View>

        {/* 🎧 Audio Section */}
        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>آڈیو پلیئر</Text>

          {Platform.OS === 'web' ? (
            <View style={styles.audioCard}>
              <audio controls style={{ width: '100%' }}>
                <source src="/shajraAudio.m4a" type="audio/mp4" />
              </audio>
            </View>
          ) : (
            <View style={styles.audioCard}>
              <TouchableOpacity
                onPress={isPlaying ? stopAudio : playAudio}
                style={[
                  styles.playButton,
                  { backgroundColor: isPlaying ? COLORS.gold : COLORS.emerald },
                ]}>
                <Text style={styles.playButtonText}>
                  {isPlaying ? 'آڈیو بند کریں' : 'آڈیو چلائیں'}
                </Text>
              </TouchableOpacity>

              <View style={styles.autoPlayContainer}>
                <Text style={styles.autoPlayLabel}>خودکار آڈیو چلائیں</Text>
                <Switch
                  value={autoPlay}
                  onValueChange={setAutoPlay}
                  trackColor={{ false: COLORS.lightGreen, true: COLORS.emerald }}
                  thumbColor={autoPlay ? COLORS.white : COLORS.gold}
                />
              </View>
            </View>
          )}
        </View>

        {/* 🖼️ Images Section */}
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>شجرہ طیبہ</Text>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={image} style={styles.image} resizeMode="contain" />
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingTop: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xl, paddingTop: SPACING.lg },
  title: {
    fontFamily: FONTS.urdu,
    fontSize: 36,
    color: COLORS.gold,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.darkGreen,
    textAlign: 'center',
    lineHeight: 32,
  },
  noteCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  note: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.darkGreen,
    textAlign: 'right',
    lineHeight: 32,
  },
  audioSection: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 24,
    color: COLORS.darkGreen,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  audioCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: SPACING.md,
  },
  playButton: {
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  playButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.white,
  },
  autoPlayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  autoPlayLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
  },
  imagesSection: { marginBottom: SPACING.xl },
  imageContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 500,
    borderRadius: BORDER_RADIUS.md,
  },
});
