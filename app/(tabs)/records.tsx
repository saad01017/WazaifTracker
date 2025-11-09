import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, TrendingUp } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { StorageService, TasbeehRecord } from '@/utils/storage';

const { width } = Dimensions.get('window');

export default function RecordsScreen() {
  const [records, setRecords] = useState<TasbeehRecord[]>([]);
  const [totalDaily, setTotalDaily] = useState(0);
  const [totalWeekly, setTotalWeekly] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalYearly, setTotalYearly] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const allRecords = await StorageService.getAllTasbeehRecords();
    setRecords(allRecords);

    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let yearly = 0;

    allRecords.forEach((record) => {
      daily += record.dailyCount || 0;
      weekly += record.weeklyCount || 0;
      monthly += record.monthlyCount || 0;
      yearly += record.yearlyCount || 0;
    });

    setTotalDaily(daily);
    setTotalWeekly(weekly);
    setTotalMonthly(monthly);
    setTotalYearly(yearly);

    calculateStreak(allRecords);
  };

  const calculateStreak = (allRecords: TasbeehRecord[]) => {
    if (allRecords.length === 0) {
      setStreak(0);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let streakDays = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const hasActivity = allRecords.some((record) => {
        const lastUpdate = new Date(record.lastUpdated).toISOString().split('T')[0];
        return lastUpdate === dateStr && (record.dailyCount || 0) > 0;
      });

      if (hasActivity) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    setStreak(streakDays);
  };

  const getNameInUrdu = (id: string, name: string): string => {
    if (id === 'astaghfar_record') return 'استغفار';
    if (id === 'durood_record') return 'درودِ شریف';
    if (id === 'tasbeeh_laIlaha') return 'لا إلهَ إلا اللهُ';
    if (id === 'tasbeeh_subhanAllah') return 'سُبْحَانَ اللهِ';
    if (id === 'tasbeeh_alhamdulillah') return 'الحَمْدُ للهِ';
    if (id === 'tasbeeh_allahuAkbar') return 'اللهُ أَكْبَرُ';
    if (id === 'tasbeeh_subhanAllahWaBihamdihi') return 'سُبْحَانَ اللهِ وَبِحَمْدِهِ';
    return name;
  };

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>ریکارڈز</Text>
          <Text style={styles.subtitle}>آپ کی ذکر کی تفصیلات</Text>
        </View>

        {streak >= 7 && (
          <View style={styles.streakCard}>
            <Award size={40} color={COLORS.gold} />
            <Text style={styles.streakText}>ماشاءاللہ! آپ نے مسلسل {streak} دن ذکر کیا۔</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalDaily}</Text>
            <Text style={styles.statLabel}>آج کی کل تعداد</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalWeekly}</Text>
            <Text style={styles.statLabel}>ہفتہ</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalMonthly}</Text>
            <Text style={styles.statLabel}>مہینہ</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalYearly}</Text>
            <Text style={styles.statLabel}>سال</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color={COLORS.darkGreen} />
            <Text style={styles.sectionTitle}>تفصیلی ریکارڈ</Text>
          </View>

          {records.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>ابھی تک کوئی ریکارڈ نہیں ہے</Text>
              <Text style={styles.emptySubtext}>ذکر شروع کریں اور اپنی پیشرفت دیکھیں</Text>
            </View>
          ) : (
            records.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <Text style={styles.recordName}>{getNameInUrdu(record.id, record.name)}</Text>
                <View style={styles.recordStats}>
                  <View style={styles.recordStatItem}>
                    <Text style={styles.recordStatValue}>{record.dailyCount || 0}</Text>
                    <Text style={styles.recordStatLabel}>آج</Text>
                  </View>
                  <View style={styles.recordStatItem}>
                    <Text style={styles.recordStatValue}>{record.weeklyCount || 0}</Text>
                    <Text style={styles.recordStatLabel}>ہفتہ</Text>
                  </View>
                  <View style={styles.recordStatItem}>
                    <Text style={styles.recordStatValue}>{record.monthlyCount || 0}</Text>
                    <Text style={styles.recordStatLabel}>مہینہ</Text>
                  </View>
                  <View style={styles.recordStatItem}>
                    <Text style={styles.recordStatValue}>{record.count || 0}</Text>
                    <Text style={styles.recordStatLabel}>کل</Text>
                  </View>
                </View>
              </View>
            ))
          )}
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
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 28,
  },
  streakCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  streakText: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.darkGreen,
    marginLeft: SPACING.md,
    flex: 1,
    lineHeight: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontFamily: FONTS.arabic,
    fontSize: 32,
    color: COLORS.gold,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 22,
    color: COLORS.darkGreen,
    marginLeft: SPACING.sm,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.darkGreen,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 28,
  },
  recordCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recordName: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: COLORS.darkGreen,
    marginBottom: SPACING.md,
    textAlign: 'right',
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordStatItem: {
    alignItems: 'center',
  },
  recordStatValue: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: COLORS.gold,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  recordStatLabel: {
    fontFamily: FONTS.urdu,
    fontSize: 12,
    color: COLORS.darkGreen,
  },
});
