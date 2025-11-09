import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { StorageService } from '@/utils/storage';

interface TasbeehCounterProps {
  storageKey: string;
  arabicText: string;
  urduNote: string;
  goal?: number;
}

export default function TasbeehCounter({ storageKey, arabicText, urduNote, goal = 100 }: TasbeehCounterProps) {
  const [count, setCount] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    const record = await StorageService.getTasbeehRecord(storageKey);
    if (record) {
      setCount(record.count);
      setDailyCount(record.dailyCount);
    }
  };

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const record = await StorageService.updateTasbeehCount(storageKey, 1);
    if (record) {
      setCount(record.count);
      setDailyCount(record.dailyCount);
    }
  };

  const handleReset = async () => {
    await StorageService.resetTasbeehCount(storageKey);
    setCount(0);
    const record = await StorageService.getTasbeehRecord(storageKey);
    if (record) {
      setDailyCount(record.dailyCount);
    }
  };

  const progress = (dailyCount % goal) / goal;
  const completedSets = Math.floor(dailyCount / goal);

  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>{arabicText}</Text>
      <Text style={styles.urduNote}>{urduNote}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>آج کی گنتی</Text>
          <Text style={styles.statValue}>{dailyCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>مکمل تسبیح</Text>
          <Text style={styles.statValue}>{completedSets}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>کل تعداد</Text>
          <Text style={styles.statValue}>{count}</Text>
        </View>
      </View>

      <View style={styles.counterContainer}>
        <View style={styles.progressRing}>
          <View style={[styles.progressFill, { transform: [{ rotate: `${progress * 360}deg` }] }]} />
        </View>

        <Animated.View
          style={[
            styles.counterButton,
            {
              transform: [{ scale: scaleAnim }],
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.6],
              }),
            },
          ]}
        >
          <TouchableOpacity onPress={handlePress} style={styles.counterTouchable}>
            <Text style={styles.counterText}>{dailyCount % goal}</Text>
            <Text style={styles.counterGoal}>/ {goal}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>دوبارہ شروع کریں</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  arabicText: {
    fontFamily: FONTS.arabic,
    fontSize: 32,
    textAlign: 'center',
    color: COLORS.darkGreen,
    marginBottom: SPACING.md,
    lineHeight: 56,
  },
  urduNote: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.gold,
    marginBottom: SPACING.xl,
    lineHeight: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  statBox: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 14,
    color: COLORS.darkGreen,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontFamily: FONTS.arabic,
    fontSize: 24,
    color: COLORS.gold,
    fontWeight: '700',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xxl,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 8,
    borderColor: COLORS.lightGreen,
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 8,
    borderColor: COLORS.emerald,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  counterButton: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  counterTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontFamily: FONTS.arabic,
    fontSize: 56,
    color: COLORS.darkGreen,
    fontWeight: '700',
  },
  counterGoal: {
    fontFamily: FONTS.arabic,
    fontSize: 24,
    color: COLORS.gold,
    marginTop: SPACING.xs,
  },
  resetButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
  },
});
