import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

export const useInfiniteFeed = (endpoint) => {
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Prevent race conditions with a ref to track current fetch status
  const isFetchingRef = useRef(false);

  const fetchRawData = async (cursor = null) => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // In production, this would use a tailored axios instance
      const response = await axios.get(endpoint, {
        params: { cursor }
      });

      const { items, nextCursor: newNextCursor } = response.data;

      if (cursor) {
          setData(prev => [...prev, ...items]);
      } else {
          setData(items);
      }
      
      setNextCursor(newNextCursor);
      setHasMore(!!newNextCursor);
      
    } catch (err) {
      console.error("Feed Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial Load
  const initFetch = useCallback(() => {
    // Reset state for a fresh load
    setHasMore(true);
    setNextCursor(null);
    // Logic to clear data is handled in fetchRawData when cursor is null, 
    // or we can explicitly clear it here if we want a "loading" flash.
    setData([]); 
    fetchRawData(null);
  }, [endpoint]);

  // Pagination Trigger
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !isFetchingRef.current) {
      fetchRawData(nextCursor);
    }
  }, [nextCursor, hasMore, loading]);

  return { 
    data, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh: initFetch 
  };
};
