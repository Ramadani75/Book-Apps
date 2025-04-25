import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#eee',
            height: 60,
            paddingBottom: 6,
            paddingTop: 4,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'index') {
              iconName = 'home-outline';
            } else if (route.name === 'search') {
              iconName = 'search-outline';
            } else if (route.name === 'my-books') {
              iconName = 'library-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Cari',
          }}
        />
        <Tabs.Screen
          name="my-books"
          options={{
            title: 'Buku Saya',
          }}
        />
        <Tabs.Screen
          name="details/[id]"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: true,
            title: 'Detail Buku',
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
