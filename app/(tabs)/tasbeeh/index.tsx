import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ChevronRight, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { StorageService, CustomTasbeeh } from '@/utils/storage';

interface DefaultTasbeeh {
  id: string;
  name: string;
  arabicText: string;
  goal: number;
}

const defaultTasbeeh: DefaultTasbeeh[] = [
  {
    id: 'laIlaha',
    name: 'لا إلهَ إلا اللهُ',
    arabicText: 'لا إلهَ إلا اللهُ',
    goal: 100,
  },
  {
    id: 'subhanAllah',
    name: 'سُبْحَانَ اللهِ',
    arabicText: 'سُبْحَانَ اللهِ',
    goal: 100,
  },
  {
    id: 'alhamdulillah',
    name: 'الحَمْدُ للهِ',
    arabicText: 'الحَمْدُ للهِ',
    goal: 100,
  },
  {
    id: 'allahuAkbar',
    name: 'اللهُ أَكْبَرُ',
    arabicText: 'اللهُ أَكْبَرُ',
    goal: 100,
  },
  {
    id: 'subhanAllahWaBihamdihi',
    name: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ العَظِيمِ',
    arabicText: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ العَظِيمِ',
    goal: 100,
  },
];

export default function TasbeehListScreen() {
  const router = useRouter();
  const [customTasbeeh, setCustomTasbeeh] = useState<CustomTasbeeh[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newArabicText, setNewArabicText] = useState('');
  const [newGoal, setNewGoal] = useState('100');

  useEffect(() => {
    loadCustomTasbeeh();
  }, []);

  const loadCustomTasbeeh = async () => {
    const custom = await StorageService.getCustomTasbeeh();
    setCustomTasbeeh(custom);
  };

  const handleAddCustom = async () => {
    if (!newName.trim() || !newArabicText.trim()) return;

    const newTasbeeh: CustomTasbeeh = {
      id: Date.now().toString(),
      name: newName,
      arabicText: newArabicText,
      goal: parseInt(newGoal) || 100,
    };

    await StorageService.addCustomTasbeeh(newTasbeeh);
    await loadCustomTasbeeh();
    setModalVisible(false);
    setNewName('');
    setNewArabicText('');
    setNewGoal('100');
  };

  const handleDeleteCustom = async (id: string) => {
    await StorageService.deleteCustomTasbeeh(id);
    await loadCustomTasbeeh();
  };

  const navigateToCounter = (id: string, arabicText: string, name: string, goal: number) => {
    router.push({
      pathname: '/tasbeeh/counter',
      params: { id, arabicText, name, goal: goal.toString() },
    } as any);
  };

  return (
    <LinearGradient
      colors={[COLORS.emerald, COLORS.cream]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>تسبیح</Text>
          <Text style={styles.subtitle}>اللہ تعالیٰ کے ذکر کی فہرست</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اہم اذکار</Text>
          {defaultTasbeeh.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tasbeehCard}
              onPress={() => navigateToCounter(`tasbeeh_${item.id}`, item.arabicText, item.name, item.goal)}>
              <Text style={styles.tasbeehText}>{item.name}</Text>
              <ChevronRight size={24} color={COLORS.gold} />
            </TouchableOpacity>
          ))}
        </View>

        {customTasbeeh.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>آپ کی تسبیحات</Text>
            {customTasbeeh.map((item) => (
              <View key={item.id} style={styles.customCard}>
                <TouchableOpacity
                  style={styles.customCardContent}
                  onPress={() => navigateToCounter(`custom_${item.id}`, item.arabicText, item.name, item.goal)}>
                  <Text style={styles.tasbeehText}>{item.name}</Text>
                  <ChevronRight size={24} color={COLORS.gold} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCustom(item.id)}>
                  <Trash2 size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>اپنی تسبیح شامل کریں</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>نئی تسبیح شامل کریں</Text>

            <Text style={styles.inputLabel}>تسبیح کا نام (اردو)</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="مثلاً: لا حول ولا قوۃ"
              placeholderTextColor={COLORS.gold}
            />

            <Text style={styles.inputLabel}>عربی متن</Text>
            <TextInput
              style={[styles.input, styles.arabicInput]}
              value={newArabicText}
              onChangeText={setNewArabicText}
              placeholder="لا حَوْلَ وَلا قُوَّةَ إِلا بِاللهِ"
              placeholderTextColor={COLORS.gold}
            />

            <Text style={styles.inputLabel}>ہدف تعداد</Text>
            <TextInput
              style={styles.input}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              placeholder="100"
              placeholderTextColor={COLORS.gold}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>منسوخ کریں</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddCustom}>
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
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'center',
    lineHeight: 28,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.urdu,
    fontSize: 22,
    color: COLORS.darkGreen,
    marginBottom: SPACING.md,
    textAlign: 'right',
  },
  tasbeehCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tasbeehText: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: COLORS.darkGreen,
    flex: 1,
    textAlign: 'right',
  },
  customCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  customCardContent: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: SPACING.sm,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: FONTS.urdu,
    fontSize: 18,
    color: COLORS.white,
    marginLeft: SPACING.sm,
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
    marginBottom: SPACING.xl,
  },
  inputLabel: {
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
  arabicInput: {
    fontFamily: FONTS.arabic,
    fontSize: 18,
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
