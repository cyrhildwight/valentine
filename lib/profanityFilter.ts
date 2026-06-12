/**
 * Multi-language profanity filtering utility.
 * Supports English, Spanish, and Tagalog/Filipino.
 */

const BAD_WORDS = [
  // --- English ---
  'fuck', 'fucking', 'fucker', 'fucking', 'motherfucker', 'shit', 'shitting', 'shitty', 
  'bitch', 'bitches', 'asshole', 'assholes', 'cunt', 'cunts', 'bastard', 'bastards', 
  'dick', 'dicks', 'pussy', 'pussies', 'whore', 'whores', 'slut', 'sluts', 'faggot', 
  'fag', 'retard', 'cock', 'cocks', 'piss', 'nigger', 'nigga', 'chink', 'kike', 
  'dyke', 'twat', 'fck',

  // --- Spanish ---
  'puta', 'puto', 'putas', 'putos', 'mierda', 'mierdas', 'pendejo', 'pendejos', 
  'cabron', 'cabrona', 'cabrones', 'maricon', 'maricones', 'joder', 'pene', 
  'vagina', 'coño', 'culero', 'verga',

  // --- Tagalog/Filipino ---
  'putangina', 'tangina', 'taengina', 'gago', 'gaga', 'tarantado', 'tarantada', 
  'kupal', 'bwisit', 'pakshet', 'pakyu', 'ulol', 'iyot', 'kantot', 'puki', 
  'tite', 'salsal', 'bayag', 'pepe', 'dede', 'bulbol'
];

const BAD_PHRASES = [
  'putang ina',
  'hijo de puta'
];

/**
 * Normalizes text to handle basic obfuscation and accents.
 */
const normalizeText = (text: string): string => {
  if (!text) return '';

  // 1. Decompose accents / diacritics (e.g., miérda -> mierda, putángina -> putangina)
  let normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 2. Convert to lowercase
  normalized = normalized.toLowerCase();

  // 3. Normalize common leetspeak substitutions
  normalized = normalized
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/5/g, 's')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/3/g, 'e');

  // 4. Clean out symbols and punctuation except spaces to help isolate words
  // Remove asterisks entirely (to convert masked words like f*ck to fuck, b*tch to bitch)
  normalized = normalized.replace(/\*/g, '');

  // Replace hyphens, underscores, etc. with spaces
  normalized = normalized.replace(/[-_\u2014\u2013]/g, ' ');

  return normalized;
};

/**
 * Checks if a string contains any profanity in English, Spanish, or Tagalog.
 */
export const containsProfanity = (text: string): boolean => {
  if (!text) return false;

  const normalized = normalizeText(text);

  // 1. Check for bad phrases first
  for (const phrase of BAD_PHRASES) {
    if (normalized.includes(phrase)) {
      return true;
    }
  }

  // 2. Check for individual bad words using word boundaries
  // We split the normalized text by non-alphanumeric characters to isolate words.
  const words = normalized.split(/[^a-z0-9]+/);

  for (const word of words) {
    if (BAD_WORDS.includes(word)) {
      return true;
    }
  }

  return false;
};
