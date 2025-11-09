import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  NotoNastaliqUrdu_400Regular,
  NotoNastaliqUrdu_700Bold,
} from '@expo-google-fonts/noto-nastaliq-urdu';
import {
  Amiri_400Regular,
  Amiri_700Bold,
} from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before fonts and framework are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // Load Urdu and Arabic fonts
  const [fontsLoaded, fontError] = useFonts({
    NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrdu_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  // Once fonts are ready, hide splash screen
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Wait until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // ✅ Navigation setup (Tabs + Error Page)
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}