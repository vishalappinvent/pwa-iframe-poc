// Server-side token storage
const serverTokens = new Set<string>();

export const addServerToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to add empty token to server storage');
    return;
  }
  serverTokens.add(token);
  console.log('Token added to server storage. Current tokens:', Array.from(serverTokens));
};

export const removeServerToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to remove empty token from server storage');
    return;
  }
  serverTokens.delete(token);
  console.log('Token removed from server storage. Current tokens:', Array.from(serverTokens));
};

export const getServerTokens = () => {
  const tokenArray = Array.from(serverTokens);
  console.log('Getting server tokens:', tokenArray);
  return tokenArray;
};

export const getServerTokenCount = () => serverTokens.size;

export const clearServerTokens = () => {
  serverTokens.clear();
  console.log('All server tokens cleared');
}; 