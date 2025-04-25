// app/search.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import { searchBooks } from '../services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const data = await searchBooks(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={onSubmit}
      />
      <BookList
        title={query ? `Hasil: ${query}` : ''}
        data={results}
        loading={loading}
        horizontal={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
