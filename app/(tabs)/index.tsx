import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, BookOpen, ListChecks, BarChart3, BookMarked, Circle } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface NavCard {
  title: string;
  icon: any;
  route: string;
  gradient: [string, string];
}

const navCards: NavCard[] = [
  {
    title: 'استغفار',
    icon: Heart,
    route: '/astaghfar',
    gradient: ['#bff5d7', '#e8f8f0'],
  },
  {
    title: 'درودِ شریف',
    icon: BookOpen,
    route: '/durood',
    gradient: ['#d8a95c', '#f0e6d2'],
  },
  {
    title: 'تسبیح',
    icon: ListChecks,
    route: '/tasbeeh',
    gradient: ['#bff5d7', '#e8f8f0'],
  },
  {
    title: 'مراقبہ',
    icon: Circle,
    route: '/muraqaba',
    gradient: ['#d8a95c', '#f0e6d2'],
  },
  {
    title: 'ریکارڈز',
    icon: BarChart3,
    route: '/records',
    gradient: ['#bff5d7', '#e8f8f0'],
  },
  {
    title: 'وُقُوفِ قلبی',
    icon: Heart,
    route: '/wuqoof',
    gradient: ['#bff5d7', '#e8f8f0'],
  },
  {
    title: 'شجرہ طیبہ',
    icon: BookMarked,
    route: '/shajra',
    gradient: ['#d8a95c', '#f0e6d2'],
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>ذکر و اذکار</Text>
          <Text style={styles.subtitle}>سلسلہ عالیہ نقشبندیہ مجددیہ</Text>
        </View>

        <View style={styles.cardsContainer}>
          {navCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => router.push(card.route as any)}>
                <LinearGradient colors={card.gradient as any} style={styles.card}>
                  <View style={styles.iconContainer}>
                    <Icon size={40} color={COLORS.darkGreen} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>اللہ تعالیٰ ہمیں مسلسل ذکر کی توفیق عطا فرمائے</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.urdu,
    fontSize: 36,
    color: COLORS.darkGreen,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 32,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  card: {
    width: 160,
    height: 160,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 20,
    color: COLORS.darkGreen,
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  footerText: {
    fontFamily: FONTS.urdu,
    fontSize: 16,
    color: COLORS.darkGreen,
    textAlign: 'center',
    lineHeight: 28,
  },
});
