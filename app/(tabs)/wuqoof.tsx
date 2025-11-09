import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { Bell, BellOff } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { StorageService } from '../../utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Added missing property
    shouldShowList: false,   // Added missing property
  }),
});

const INTERVALS = [
  { label: 'بند', value: 0 },
  { label: '30 منٹ', value: 30 },
  { label: '1 گھنٹہ', value: 60 },
  { label: '2 گھنٹے', value: 120 },
  { label: '3 گھنٹے', value: 180 },
];

export default function WuqoofScreen() {
  const [enabled, setEnabled] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(60);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      setHasPermission(false);
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setHasPermission(finalStatus === 'granted');
  };

  const loadSettings = async () => {
    const settings = await StorageService.getWuqoofSettings();
    if (settings) {
      setEnabled(settings.enabled);
      setSelectedInterval(settings.interval);
    }
  };

  const scheduleNotifications = async (interval: number) => {
    if (Platform.OS === 'web') {
      Alert.alert('نوٹیفیکیشن', 'ویب پر نوٹیفیکیشن دستیاب نہیں ہیں۔');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (interval > 0 && hasPermission) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'وُقُوفِ قلبی',
          body: 'دل میں اللہ کو یاد رکھیں 💚',
          sound: true,
        },
        trigger: {
          seconds: interval * 60,
          repeats: true,
        },
      });
    } else {
      Alert.alert('نوٹیفیکیشن', 'نوٹیفیکیشن کی اجازت نہیں ملی یا وقفہ درست نہیں ہے۔');
    }
  };

  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    if (newEnabled) {
      await scheduleNotifications(selectedInterval);
    } else {
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }

    await StorageService.saveWuqoofSettings({
      enabled: newEnabled,
      interval: selectedInterval,
    });
  };

  const handleIntervalChange = async (interval: number) => {
    setSelectedInterval(interval);
    setEnabled(interval > 0);

    await scheduleNotifications(interval);
    await StorageService.saveWuqoofSettings({
      enabled: interval > 0,
      interval,
    });
  };

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>وُقُوفِ قلبی</Text>
          <Text style={styles.subtitle}>دل کی حاضری</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.description}>
            دل میں ہر لمحہ خاموشی سے اللہ کو یاد کرنے کا نام وُقُوفِ قلبی ہے۔
          </Text>
          <Text style={styles.descriptionNote}>
            یہ یاد دہانی آپ کو باقاعدگی سے اللہ کے ذکر کی طرف متوجہ کرتی ہے۔
          </Text>
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              نوٹیفیکیشن صرف موبائل ایپ میں دستیاب ہیں۔
            </Text>
          </View>
        )}

        {Platform.OS !== 'web' && !hasPermission && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              نوٹیفیکیشن کی اجازت نہیں ملی۔ براہ کرم سیٹنگز سے اجازت دیں۔
            </Text>
          </View>
        )}

        <View style={styles.toggleCard}>
          <TouchableOpacity onPress={handleToggle} style={styles.toggleHeader}>
            {enabled ? (
              <Bell size={32} color={COLORS.darkGreen} />
            ) : (
              <BellOff size={32} color={COLORS.gold} />
            )}
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>
                {enabled ? 'یاد دہانی چالو ہے' : 'یاد دہانی بند ہے'}
              </Text>
              {enabled && selectedInterval > 0 && (
                <Text style={styles.toggleSubtitle}>
                  ہر {selectedInterval >= 60 ? `${selectedInterval / 60} گھنٹے` : `${selectedInterval} منٹ`} بعد
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وقفہ منتخب کریں</Text>
          {INTERVALS.map((interval) => (
            <TouchableOpacity
              key={interval.value}
              style={[
                styles.intervalOption,
                selectedInterval === interval.value && styles.intervalOptionActive,
              ]}
              onPress={() => handleIntervalChange(interval.value)}>
              <Text
                style={[
                  styles.intervalLabel,
                  selectedInterval === interval.value && styles.intervalLabelActive,
                ]}>
                {interval.label}
              </Text>
              {selectedInterval === interval.value && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    fontSize: 20,
    color: COLORS.gold,
    textAlign: 'center',
  },
  descriptionCard: {
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
  description: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.darkGreen,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: SPACING.md,
  },
  descriptionNote: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'right',
    lineHeight: 28,
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  warningText: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 28,
  },
  toggleCard: {
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
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  toggleTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.darkGreen,
    marginBottom: SPACING.xs,
  },
  toggleSubtitle: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.gold,
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
  intervalOption: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  intervalOptionActive: {
    borderColor: COLORS.emerald,
    backgroundColor: COLORS.lightGreen,
  },
  intervalLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.darkGreen,
  },
  intervalLabelActive: {
    color: COLORS.darkGreen,
    fontWeight: '600',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
