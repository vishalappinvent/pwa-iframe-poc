import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'fcm-tokens.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(TOKENS_FILE))) {
  fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
}

// Initialize tokens from file if it exists
let serverTokens = new Set<string>();
try {
  if (fs.existsSync(TOKENS_FILE)) {
    const storedTokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
    serverTokens = new Set(storedTokens);
  }
} catch (error) {
  console.error('Error reading tokens file:', error);
}

// Save tokens to file
const saveTokens = () => {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(Array.from(serverTokens)));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

export const addServerToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to add empty token to server storage');
    return;
  }
  serverTokens.add(token);
  saveTokens();
  console.log('Token added to server storage. Current tokens:', Array.from(serverTokens));
};

export const removeServerToken = (token: string) => {
  if (!token) {
    console.warn('Attempted to remove empty token from server storage');
    return;
  }
  serverTokens.delete(token);
  saveTokens();
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
  saveTokens();
  console.log('All server tokens cleared');
};

// Remove multiple tokens at once
export const removeServerTokens = (tokens: string[]) => {
  tokens.forEach(token => serverTokens.delete(token));
  saveTokens();
  console.log('Removed multiple tokens. Current tokens:', Array.from(serverTokens));
}; 