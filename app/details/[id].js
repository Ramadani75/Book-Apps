// app/details/[id].js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getBookDetails } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // load details & saved state
    (async () => {
      setLoading(true);
      const details = await getBookDetails(id);
      setBook(details);
      setLoading(false);

      const saved = JSON.parse(
        (await AsyncStorage.getItem('savedBooks')) || '[]'
      );
      setIsSaved(saved.some((b) => b.id === id));
    })();
  }, [id]);

  const toggleSaveBook = async () => {
    try {
      const saved = JSON.parse(
        (await AsyncStorage.getItem('savedBooks')) || '[]'
      );
      const updated = isSaved
        ? saved.filter((b) => b.id !== id)
        : [...saved, { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage }];
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updated));
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling saved book:', err);
    }
  };

  const shareBook = () => {
    Share.share({
      message: `Check out this book: ${book?.title} by ${book?.author}`,
      title: 'Detail Buku',
    });
  };

  return (
    <>
      {/* Always show static title */}
      <Stack.Screen
        options={{
          title: 'Detail Buku',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={shareBook} style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color="#0066cc" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSaveBook} style={styles.headerButton}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color="#0066cc"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : !book ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Could not load book details</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: book.coverImage }} style={styles.cover} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              {book.publishDate && (
                <Text style={styles.publishDate}>Published: {book.publishDate}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang Buku</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>

          {book.subjects?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subjects</Text>
              <View style={styles.tagsContainer}>
                {book.subjects.slice(0, 10).map((subj, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{subj}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="book-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Read Sample</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, isSaved && styles.savedButton]}
              onPress={toggleSaveBook}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? '#fff' : '#0066cc'}
              />
              <Text
                style={[
                  styles.secondaryButtonText,
                  isSaved && styles.savedButtonText,
                ]}
              >
                {isSaved ? 'Tersimpan' : 'Simpan untuk nanti'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#666', textAlign: 'center' },
  headerButtons: { flexDirection: 'row', marginRight: 12 },
  headerButton: { marginLeft: 15 },
  header: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  cover: { width: 120, height: 180, borderRadius: 8 },
  titleContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  author: { fontSize: 16, color: '#666', marginBottom: 8 },
  publishDate: { fontSize: 14, color: '#888' },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#f0f0f0', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, margin: 4 },
  tagText: { fontSize: 14, color: '#666' },
  actionsContainer: { padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
  primaryButton: { backgroundColor: '#0066cc', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  secondaryButton: { borderColor: '#0066cc', borderWidth: 1, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 8 },
  secondaryButtonText: { color: '#0066cc', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  savedButton: { backgroundColor: '#0066cc', borderColor: '#0066cc' },
  savedButtonText: { color: '#fff' },
});
