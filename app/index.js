// app/index.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BookCard from '../components/BookCard';
import { getTrendingBooks, getAllBooks } from '../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingTrending(true);
      const t = await getTrendingBooks();
      setTrendingBooks(t);
      setLoadingTrending(false);

      setLoadingAll(true);
      const a = await getAllBooks();
      setAllBooks(a);
      setLoadingAll(false);
    })();
  }, []);

  const goToSearch = () => router.push('/search');
  const goToMyBooks = () => router.push('/my-books');

  const renderHeader = () => (
    <>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Temukan Buku Baru</Text>
        <Text style={styles.welcomeSubtitle}>
          Ketuk ikon pencarian di atas untuk menemukan bacaan Anda berikutnya
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Buku yang Sedang Tren</Text>
      {loadingTrending ? (
        <ActivityIndicator style={styles.indicator} color="#0066cc" />
      ) : (
        <FlatList
          data={trendingBooks}
          renderItem={({ item }) => <BookCard book={item} horizontal />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingList}
        />
      )}

      <Text style={styles.sectionHeader}>Daftar Buku</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Book Explorer',
          
          headerLeft: null,
        }}
      />

      {loadingTrending || loadingAll ? (
        <ActivityIndicator style={styles.centerIndicator} size="large" color="#0066cc" />
      ) : (
        <FlatList
          data={allBooks}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <BookCard book={item} horizontal={false} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerIcons: { flexDirection: 'row', paddingRight: 15 },
  iconBtn: { marginHorizontal: 8 },
  welcomeSection: { padding: 16, marginBottom: 16 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: '#666', lineHeight: 22 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  trendingList: { paddingLeft: 16, paddingRight: 8 },
  indicator: { marginVertical: 12 },
  centerIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: CARD_MARGIN },
  row: { justifyContent: 'space-between', marginBottom: CARD_MARGIN },
  cardContainer: { width: CARD_WIDTH, marginBottom: CARD_MARGIN },
});
