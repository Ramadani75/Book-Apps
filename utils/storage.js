// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveBook = async (book) => {
  try {
    const savedBooks = await AsyncStorage.getItem('savedBooks');
    let booksArray = savedBooks !== null ? JSON.parse(savedBooks) : [];
    
    // Check if book already exists in saved books
    if (!booksArray.some(savedBook => savedBook.id === book.id)) {
      booksArray.push(book);
      await AsyncStorage.setItem('savedBooks', JSON.stringify(booksArray));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving book:', error);
    return false;
  }
};

export const removeBook = async (bookId) => {
  try {
    const savedBooks = await AsyncStorage.getItem('savedBooks');
    if (savedBooks !== null) {
      const booksArray = JSON.parse(savedBooks);
      const updatedBooks = booksArray.filter(book => book.id !== bookId);
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing book:', error);
    return false;
  }
};

export const isBookSaved = async (bookId) => {
  try {
    const savedBooks = await AsyncStorage.getItem('savedBooks');
    if (savedBooks !== null) {
      const booksArray = JSON.parse(savedBooks);
      return booksArray.some(book => book.id === bookId);
    }
    return false;
  } catch (error) {
    console.error('Error checking saved book:', error);
    return false;
  }
};

export const getAllSavedBooks = async () => {
  try {
    const savedBooks = await AsyncStorage.getItem('savedBooks');
    return savedBooks !== null ? JSON.parse(savedBooks) : [];
  } catch (error) {
    console.error('Error getting saved books:', error);
    return [];
  }
};

export const clearAllSavedBooks = async () => {
  try {
    await AsyncStorage.removeItem('savedBooks');
    return true;
  } catch (error) {
    console.error('Error clearing saved books:', error);
    return false;
  }
};