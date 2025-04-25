// app/index.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BookList from '../components/BookList';
import { getTrendingBooks, getPopularCategories } from '../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    (async () => {
      // fetch trending
      setLoadingTrending(true);
      const t = await getTrendingBooks();
      setTrendingBooks(t);
      setLoadingTrending(false);

      // fetch categories
      setLoadingCategories(true);
      const c = await getPopularCategories();
      setCategories(c);
      setLoadingCategories(false);
    })();
  }, []);

  const goToSearch = () => router.push('/search');
  const goToMyBooks = () => router.push('/my-books');

  // simple shimmer placeholder
  const renderShimmer = () => (
    <View style={styles.shimmerRow}>
      {[...Array(4)].map((_, i) => (
        <View key={i} style={styles.shimmerCard} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Book Explorer',
          headerRight: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={goToSearch} style={styles.iconBtn}>
                <Ionicons name="search-outline" size={24} color="#0066cc" />
              </TouchableOpacity>
              <TouchableOpacity onPress={goToMyBooks} style={styles.iconBtn}>
                <Ionicons name="library-outline" size={24} color="#0066cc" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: null,
        }}
      />

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Discover new books</Text>
              <Text style={styles.welcomeSubtitle}>
                Tap the search icon above to find your next read
              </Text>
            </View>

            {/* Trending Books */}
            {loadingTrending
              ? renderShimmer()
              : (
                <BookList
                  title="Trending Books"
                  data={trendingBooks}
                  loading={false}
                  horizontal
                />
              )
            }

            {/* Popular Categories */}
            {loadingCategories
              ? renderShimmer()
              : (
                <BookList
                  title="Popular Categories"
                  data={categories}
                  loading={false}
                  horizontal
                />
              )
            }
          </>
        }
        data={[]}
        renderItem={null}
        keyExtractor={() => 'dummy'}
      />
    </SafeAreaView>
  );
}

const CARD_WIDTH = 120, CARD_HEIGHT = 180;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerIcons: { flexDirection: 'row', paddingRight: 15 },
  iconBtn: { marginHorizontal: 8 },
  welcomeSection: {
    padding: 16, marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16, color: '#666', lineHeight: 22,
  },
  shimmerRow: {
    flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16,
  },
  shimmerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
  },
});
