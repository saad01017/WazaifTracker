import { Stack } from 'expo-router';

export default function TasbeehLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="counter" />
    </Stack>
  );
}
