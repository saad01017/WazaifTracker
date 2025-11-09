import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

const DURATIONS = [
  { label: '15 منٹ', value: 15 },
  { label: '30 منٹ', value: 30 },
  { label: '45 منٹ', value: 45 },
  { label: '1 گھنٹہ', value: 60 },
  { label: 'اپنی پسند', value: 0 },
];

export default function MuraqabaScreen() {
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [customDuration, setCustomDuration] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const glowAnim1 = useRef(new Animated.Value(0)).current;
  const glowAnim2 = useRef(new Animated.Value(0)).current;
  const glowAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim2, {
            toValue: 1,
            duration: 2500,
            delay: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim2, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim3, {
            toValue: 1,
            duration: 3000,
            delay: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim3, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleDurationSelect = (value: number) => {
    if (value === 0) {
      setModalVisible(true);
    } else {
      setSelectedDuration(value);
      setIsActive(false);
      setTimeLeft(0);
    }
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customDuration);
    if (minutes && minutes > 0) {
      setSelectedDuration(minutes);
      setModalVisible(false);
      setCustomDuration('');
      setIsActive(false);
      setTimeLeft(0);
    }
  };

  const handleStart = () => {
    if (!isActive) {
      setTimeLeft(selectedDuration * 60);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const opacity1 = glowAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity2 = glowAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const opacity3 = glowAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>مراقبہ</Text>
          <Text style={styles.subtitle}>اللہ کی یاد میں خاموش بیٹھنا</Text>
        </View>

        <View style={styles.allahContainer}>
          <View style={styles.glowContainer}>
            <Animated.View style={[styles.glowCircle, styles.glow1, { opacity: opacity1 }]} />
            <Animated.View style={[styles.glowCircle, styles.glow2, { opacity: opacity2 }]} />
            <Animated.View style={[styles.glowCircle, styles.glow3, { opacity: opacity3 }]} />
            <Text style={styles.allahText}>اللہ اللہ اللہ</Text>
          </View>
        </View>

        {isActive && timeLeft > 0 && (
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وقت منتخب کریں</Text>
          <View style={styles.durationGrid}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration.value}
                style={[
                  styles.durationButton,
                  selectedDuration === duration.value && duration.value !== 0 && styles.durationButtonActive,
                ]}
                onPress={() => handleDurationSelect(duration.value)}
                disabled={isActive}>
                <Text
                  style={[
                    styles.durationLabel,
                    selectedDuration === duration.value && duration.value !== 0 && styles.durationLabelActive,
                  ]}>
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.poetryCard}>
          <Text style={styles.poetry}>
            اُلٹی ہی چل چلتِے ہیں، دیوانۂ عشق{'\n'}
            آنکھوں کو بند کرتے ہیں دیدار کے لئے
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {!isActive ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>مراقبہ شروع کریں</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeButtons}>
              <TouchableOpacity style={styles.pauseButton} onPress={handleStart}>
                <Text style={styles.pauseButtonText}>روکیں</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                <Text style={styles.stopButtonText}>ختم کریں</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اپنا وقت منتخب کریں</Text>
            <Text style={styles.modalLabel}>منٹ میں وقت درج کریں</Text>
            <TextInput
              style={styles.input}
              value={customDuration}
              onChangeText={setCustomDuration}
              keyboardType="numeric"
              placeholder="مثلاً: 20"
              placeholderTextColor={COLORS.gold}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setCustomDuration('');
                }}>
                <Text style={styles.cancelButtonText}>منسوخ کریں</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCustomDuration}>
                <Text style={styles.saveButtonText}>محفوظ کریں</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.urdu,
    fontSize: 36,
    color: COLORS.darkGreen,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 32,
  },
  allahContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  glowContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 280,
  },
  glowCircle: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.emerald,
  },
  glow1: {
    width: 280,
    height: 280,
  },
  glow2: {
    width: 220,
    height: 220,
  },
  glow3: {
    width: 160,
    height: 160,
  },
  allahText: {
    fontFamily: FONTS.arabic,
    fontSize: 48,
    color: COLORS.darkGreen,
    textAlign: 'center',
    lineHeight: 80,
    fontWeight: '700',
    zIndex: 1,
  },
  timerDisplay: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  timerText: {
    fontFamily: FONTS.arabic,
    fontSize: 56,
    color: COLORS.darkGreen,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 22,
    color: COLORS.darkGreen,
    marginBottom: SPACING.lg,
    textAlign: 'right',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  durationButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minWidth: 100,
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  durationButtonActive: {
    borderColor: COLORS.emerald,
    backgroundColor: COLORS.lightGreen,
  },
  durationLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
    textAlign: 'center',
  },
  durationLabelActive: {
    fontWeight: '600',
  },
  poetryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  poetry: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 40,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  startButton: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  startButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.white,
  },
  activeButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pauseButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.white,
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 24,
    color: COLORS.darkGreen,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
    marginBottom: SPACING.sm,
    textAlign: 'right',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.urdu,
    fontSize: 16,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  cancelButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  saveButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
});
