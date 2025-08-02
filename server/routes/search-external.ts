import { Router } from 'express';

const router = Router();

// Mock external search API - in production, integrate with TMDB, AniList, etc.
router.get('/', async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query || !type) {
      return res.status(400).json({ error: 'Query and type are required' });
    }

    // Mock search results based on media type
    const mockResults = generateMockResults(query as string, type as string);
    
    res.json(mockResults);
  } catch (error) {
    console.error('External search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

function generateMockResults(query: string, type: string): any[] {
  // Mock data structure for different media types
  const results = [];
  
  if (type === 'Movies') {
    results.push({
      title: `${query} (2023)`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Movie+Poster',
      description: `A captivating movie about ${query.toLowerCase()} that takes viewers on an extraordinary journey.`,
      releaseYear: 2023,
      genres: ['Action', 'Drama'],
      externalId: 'mock_movie_' + Date.now()
    });
    
    results.push({
      title: `${query}: The Beginning`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Movie+Poster+2',
      description: `The origin story of ${query.toLowerCase()} with stunning visuals and compelling characters.`,
      releaseYear: 2022,
      genres: ['Sci-Fi', 'Adventure'],
      externalId: 'mock_movie_2_' + Date.now()
    });
  } else if (type === 'Anime') {
    results.push({
      title: `${query}`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Anime+Poster',
      description: `An epic anime series featuring ${query.toLowerCase()} with amazing animation and storytelling.`,
      releaseYear: 2023,
      genres: ['Fantasy', 'Action'],
      externalId: 'mock_anime_' + Date.now()
    });
    
    results.push({
      title: `${query}: Next Generation`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Anime+Poster+2',
      description: `The sequel to the beloved ${query.toLowerCase()} series with new adventures.`,
      releaseYear: 2024,
      genres: ['Adventure', 'Supernatural'],
      externalId: 'mock_anime_2_' + Date.now()
    });
  } else if (type === 'Manhwa' || type === 'Pornhwa') {
    results.push({
      title: `${query}`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Manhwa+Cover',
      description: `A gripping ${type.toLowerCase()} series about ${query.toLowerCase()} with beautiful artwork.`,
      releaseYear: 2023,
      genres: ['Romance', 'Drama'],
      externalId: 'mock_manhwa_' + Date.now()
    });
  } else if (type === 'Novels') {
    results.push({
      title: `${query}`,
      imageUrl: 'https://via.placeholder.com/300x450?text=Novel+Cover',
      description: `An engaging novel exploring themes of ${query.toLowerCase()} with rich character development.`,
      releaseYear: 2023,
      genres: ['Fantasy', 'Mystery'],
      externalId: 'mock_novel_' + Date.now()
    });
  } else if (type === 'TV Shows') {
    results.push({
      title: `${query}`,
      imageUrl: 'https://via.placeholder.com/300x450?text=TV+Show+Poster',
      description: `A compelling TV series about ${query.toLowerCase()} that keeps viewers on the edge of their seats.`,
      releaseYear: 2023,
      genres: ['Drama', 'Thriller'],
      externalId: 'mock_tv_' + Date.now()
    });
  }
  
  return results.slice(0, 5); // Return max 5 results
}

export default router;