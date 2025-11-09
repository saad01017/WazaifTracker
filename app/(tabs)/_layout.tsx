import { Tabs } from 'expo-router';
import { Home, BookOpen, ListChecks, BarChart3, Heart, BookMarked, Circle } from 'lucide-react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '@/constants/theme';
import AudioPlayer from '@/components/AudioPlayer';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.darkGreen,
        tabBarInactiveTintColor: COLORS.gold,
        tabBarStyle: {
          backgroundColor: COLORS.cream,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGreen,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ہوم',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="astaghfar"
        options={{
          title: 'استغفار',
          tabBarIcon: ({ size, color }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="durood"
        options={{
          title: 'درود',
          tabBarIcon: ({ size, color }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasbeeh"
        options={{
          title: 'تسبیح',
          tabBarIcon: ({ size, color }) => <ListChecks size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="muraqaba"
        options={{
          title: 'مراقبہ',
          tabBarIcon: ({ size, color }) => <Circle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'ریکارڈز',
          tabBarIcon: ({ size, color }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wuqoof"
        options={{
          title: 'وقوف',
          tabBarIcon: ({ size, color }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shajra"
        options={{
          title: 'شجرہ',
          tabBarIcon: ({ size, color }) => <BookMarked size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
export default function ShajraScreen() {
  const audioSource = require('../../assets/audio/shajraAudio.m4a');

  const images = [
    require('@/assets/images/shijra1.jpg'),
    require('@/assets/images/Shaijra2.jpg'),
    require('@/assets/images/shijra3.jpg'),
    require('@/assets/images/shijra4.jpg'),
    require('@/assets/images/shijra5.jpg'),
    require('@/assets/images/shijra6 copy.jpg'),
    require('@/assets/images/shijra7 copy.jpg'),
    require('@/assets/images/shijra8 copy.jpg'),
    require('@/assets/images/Shijra9 copy.jpg'),
  ];

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

        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>آڈیو پلیئر</Text>
          <AudioPlayer audioSource={audioSource} />
        </View>

        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>شجرہ طیبہ</Text>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={image}
                style={styles.image}
                resizeMode="contain" />
            </View>
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
    fontSize: 18,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 32,
  },
  audioSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 24,
    color: COLORS.darkGreen,
    marginBottom: SPACING.lg,
    textAlign: 'right',
  },
  imagesSection: {
    marginBottom: SPACING.xl,
  },
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
{
  "expo"; {
    "android"; {
      "permissions";["android.permission.RECORD_AUDIO"],
        "package"; "com.yourname.wazaiftracker";
    }
    "plugins";[
      [
        "expo-av",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
        }
      ]
    ];
  }
}
