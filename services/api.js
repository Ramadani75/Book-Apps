// services/api.js
export const searchBooks = async (query) => {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      
      
      const formattedData = data.docs.map(book => ({
        id: book.key?.replace('/works/', '') || Math.random().toString(),
        title: book.title || 'Unknown Title',
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        coverImage: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
          : 'https://via.placeholder.com/150x200?text=No+Cover',
        publishYear: book.first_publish_year || 'Unknown',
        language: book.language ? book.language[0] : 'Unknown',
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };
  
  export const getBookDetails = async (bookId) => {
    try {
      const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
      const data = await response.json();
      
      
      let authorData = { name: 'Unknown Author' };
      if (data.authors && data.authors[0]?.author) {
        const authorKey = data.authors[0].author.key;
        const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
        authorData = await authorResponse.json();
      }
      
      
      const bookDetails = {
        id: bookId,
        title: data.title || 'Unknown Title',
        author: authorData.name || 'Unknown Author',
        description: data.description?.value || data.description || 'No description available',
        coverImage: data.covers && data.covers[0] 
          ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` 
          : 'https://via.placeholder.com/300x450?text=No+Cover',
        publishDate: data.first_publish_date || 'Unknown',
        subjects: data.subjects || [],
      };
      
      return bookDetails;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  };
  
  export const getTrendingBooks = async () => {
    try {
      const response = await fetch('https://openlibrary.org/trending/daily.json?limit=10');
      const data = await response.json();
      
      
      const formattedData = data.works.map(book => ({
        id: book.key?.replace('/works/', '') || Math.random().toString(),
        title: book.title || 'Unknown Title',
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        coverImage: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
          : 'https://via.placeholder.com/150x200?text=No+Cover',
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching trending books:', error);
      return [];
    }
  };