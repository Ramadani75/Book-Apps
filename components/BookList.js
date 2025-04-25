// components/BookList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BookCard from './BookCard';

const BookList = ({ title, data, loading, horizontal = true, onEndReached }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={({ item }) => <BookCard book={item} horizontal={!horizontal} />}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.horizontalList : styles.verticalList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
  },
  horizontalList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  verticalList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BookList;