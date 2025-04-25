// components/BookCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const BookCard = ({ book, horizontal = false }) => {
  const router = useRouter();

  const navigateToDetail = () => {
    router.push(`/details/${book.id}`);
  };

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={navigateToDetail}>
        <Image source={{ uri: book.coverImage }} style={styles.horizontalCover} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          {book.publishYear && (
            <Text style={styles.publishYear}>{book.publishYear}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={navigateToDetail}>
      <Image source={{ uri: book.coverImage }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  publishYear: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  horizontalCard: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalCover: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  horizontalInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});

export default BookCard;
