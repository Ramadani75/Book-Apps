// app/_layout.js
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f5f5' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* HomeScreen di app/index.js */}
        <Stack.Screen name="index" options={{ title: 'Home' }} />

        {/* Jika ada halaman Search di app/search.js */}
        <Stack.Screen name="search" options={{ title: 'Cari Buku' }} />

        {/* Halaman My Books di app/my-books.js */}
        <Stack.Screen name="my-books" options={{ title: 'My Books' }} />

        {/* DetailBook di app/details/[id].js */}
        <Stack.Screen
          name="details/[id]"
          options={{ title: 'Detail Buku' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
