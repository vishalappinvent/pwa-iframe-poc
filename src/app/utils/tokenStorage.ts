// Global token storage that works on both client and server
const globalTokens = new Set<string>();

// Client-side localStorage sync
if (typeof window !== 'undefined') {
  // Initialize from localStorage on client
  const storedTokens = JSON.parse(localStorage.getItem('fcm_tokens') || '[]');
  storedTokens.forEach((token: string) => globalTokens.add(token));

  // Save to localStorage whenever tokens change
  const saveToLocalStorage = () => {
    localStorage.setItem('fcm_tokens', JSON.stringify(Array.from(globalTokens)));
  };

  // Override the add and remove methods to sync with localStorage
  const originalAdd = globalTokens.add.bind(globalTokens);
  const originalDelete = globalTokens.delete.bind(globalTokens);

  globalTokens.add = function(token: string) {
    const result = originalAdd(token);
    saveToLocalStorage();
    return result;
  };

  globalTokens.delete = function(token: string) {
    const result = originalDelete(token);
    saveToLocalStorage();
    return result;
  };
}

export const addToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to add empty token');
    return;
  }
  globalTokens.add(token);
  console.log('Token added. Current tokens:', Array.from(globalTokens));
};

export const removeToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to remove empty token');
    return;
  }
  globalTokens.delete(token);
  console.log('Token removed. Current tokens:', Array.from(globalTokens));
};

export const getAllTokens = () => {
  const tokenArray = Array.from(globalTokens);
  console.log('Getting all tokens:', tokenArray);
  return tokenArray;
};

export const hasToken = (token: string) => {
  return globalTokens.has(token);
};

export const getTokenCount = () => globalTokens.size;

export const clearTokens = () => {
  globalTokens.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fcm_tokens');
  }
  console.log('All tokens cleared');
}; 