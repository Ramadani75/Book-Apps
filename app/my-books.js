// app/my-books.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookCard from '../components/BookCard';

export default function MyBooksScreen() {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedBooks();
  }, []);

  const loadSavedBooks = async () => {
    try {
      setLoading(true);
      const books = await AsyncStorage.getItem('savedBooks');
      if (books !== null) {
        setSavedBooks(JSON.parse(books));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading saved books:', error);
      setLoading(false);
    }
  };

  const removeBook = async (bookId) => {
    try {
      const updatedBooks = savedBooks.filter(book => book.id !== bookId);
      setSavedBooks(updatedBooks);
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const confirmRemoveBook = (book) => {
    Alert.alert(
      'Remove Book',
      `Are you sure you want to remove "${book.title}" from your saved books?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeBook(book.id) },
      ]
    );
  };

  const clearAllBooks = async () => {
    try {
      await AsyncStorage.removeItem('savedBooks');
      setSavedBooks([]);
    } catch (error) {
      console.error('Error clearing saved books:', error);
    }
  };

  const confirmClearAll = () => {
    if (savedBooks.length === 0) return;
    
    Alert.alert(
      'Clear All Books',
      'Are you sure you want to remove all books from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllBooks },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <BookCard book={item} horizontal={true} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => confirmRemoveBook(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Buku Saya',
          headerRight: () => (
            savedBooks.length > 0 ? (
              <TouchableOpacity onPress={confirmClearAll} style={styles.headerButton}>
                <Text style={styles.clearText}>Hapus Semua</Text>
              </TouchableOpacity>
            ) : null
          ),
        }}
      />

      {loading ? (
        <View style={styles.messageContainer}>
          <Text>Loading your books...</Text>
        </View>
      ) : savedBooks.length === 0 ? (
        <View style={styles.messageContainer}>
          <Ionicons name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyMessage}>Your collection is empty</Text>
          <Text style={styles.emptySubMessage}>
            Save books from search results to build your collection
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerButton: {
    marginRight: 15,
  },
  clearText: {
    color: '#ff3b30',
    fontWeight: '500',
  },
  list: {
    padding: 8,
  },
  bookItem: {
    marginBottom: 4,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});