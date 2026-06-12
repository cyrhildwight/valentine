export interface PublicConfession {
  id: string;
  to: string;
  from: string;
  message: string;
  theme: 'vintage' | 'neon' | 'midnight';
  desc: string;
  rotation: number;
  timestamp: number;
}

const DEFAULT_CONFESSIONS: PublicConfession[] = [
  {
    id: 'default-1',
    to: 'To: My Best Friend',
    from: 'From: A Secret Admirer',
    message: "I've been in love with you for as long as I can remember. Seeing you laugh is the best part of my day, and I hope one day I have the courage to tell you myself. You make my world complete.",
    theme: 'midnight',
    desc: 'Passionate & True',
    rotation: -2.5,
    timestamp: 1718160000000 - 40000,
  },
  {
    id: 'default-2',
    to: 'To: The Girl in my CS class',
    from: 'From: Someone in the Back Row',
    message: "You make me laugh like nobody else can. Your bright energy is infectious, and my heart does flips whenever you sit near me. You make this stressful class so much happier.",
    theme: 'neon',
    desc: 'Joy & Laughter',
    rotation: 2,
    timestamp: 1718160000000 - 30000,
  },
  {
    id: 'default-3',
    to: 'To: The Barista at French Cafe',
    from: 'From: The Latte Lover',
    message: "I admire your kindness, your intelligence, and the gentle way you carry yourself. You deserve all the beauty in the world, and I'm so grateful you exist. Keep shining.",
    theme: 'vintage',
    desc: 'Quiet Admiration',
    rotation: -1.5,
    timestamp: 1718160000000 - 20000,
  },
  {
    id: 'default-4',
    to: 'To: The Quiet Soul',
    from: 'From: A Safe Harbor',
    message: "You are my safe space, a calm in every storm. Even if you never know this confession is from me, please know that you are deeply loved, cherished, and valued.",
    theme: 'vintage',
    desc: 'Devoted Comfort',
    rotation: 3.5,
    timestamp: 1718160000000 - 10000,
  }
];

export const getPublicConfessions = (): PublicConfession[] => {
  if (typeof window === 'undefined') return DEFAULT_CONFESSIONS;
  try {
    const deletedDefaultsSaved = localStorage.getItem('deleted_default_confessions');
    const deletedDefaults: string[] = deletedDefaultsSaved ? JSON.parse(deletedDefaultsSaved) : [];
    const filteredDefaults = DEFAULT_CONFESSIONS.filter(item => !deletedDefaults.includes(item.id));

    const saved = localStorage.getItem('public_confessions');
    if (saved) {
      const parsed = JSON.parse(saved) as PublicConfession[];
      const validSaved = parsed.filter(item => item && item.id && item.to && item.message);
      return [...validSaved, ...filteredDefaults];
    }
    return filteredDefaults;
  } catch (e) {
    console.error('Error reading confessions from localStorage:', e);
  }
  return DEFAULT_CONFESSIONS;
};

const THEME_DESCRIPTIONS = {
  vintage: ['Warm & Classic', 'Quiet Devotion', 'Sweet Whisper', 'Timeless Love'],
  neon: ['Vibrant Spark', 'Electric Love', 'Bright Passion', 'Bold Devotion'],
  midnight: ['Midnight Mystery', 'Deep & Tender', 'Shadow Whisper', 'Secret Romance']
};

export const addPublicConfession = (
  confession: Omit<PublicConfession, 'id' | 'timestamp' | 'desc' | 'rotation'>
): PublicConfession => {
  const rotation = parseFloat((Math.random() * 6 - 3).toFixed(2)); // Random rotation between -3 and 3
  
  const theme = confession.theme || 'vintage';
  const descriptions = THEME_DESCRIPTIONS[theme];
  const desc = descriptions[Math.floor(Math.random() * descriptions.length)];

  // Clean strings
  const cleanTo = confession.to.trim();
  const to = cleanTo.toLowerCase().startsWith('to:') ? cleanTo : `To: ${cleanTo}`;
  
  const cleanFrom = confession.from.trim();
  const from = cleanFrom ? (cleanFrom.toLowerCase().startsWith('from:') ? cleanFrom : `From: ${cleanFrom}`) : 'From: Anonymous';

  const newConf: PublicConfession = {
    ...confession,
    theme,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    to,
    from,
    desc,
    rotation,
    timestamp: Date.now()
  };

  try {
    const saved = localStorage.getItem('public_confessions');
    let parsed: PublicConfession[] = [];
    if (saved) {
      parsed = JSON.parse(saved) as PublicConfession[];
    }
    // Limit to 20 user confessions to keep local storage clean
    parsed = [newConf, ...parsed].slice(0, 20);
    localStorage.setItem('public_confessions', JSON.stringify(parsed));
  } catch (e) {
    console.error('Error saving confession to localStorage:', e);
  }

  return newConf;
};

export const deletePublicConfession = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (id.startsWith('default-')) {
      const deletedDefaultsSaved = localStorage.getItem('deleted_default_confessions');
      let deletedDefaults: string[] = deletedDefaultsSaved ? JSON.parse(deletedDefaultsSaved) : [];
      if (!deletedDefaults.includes(id)) {
        deletedDefaults.push(id);
        localStorage.setItem('deleted_default_confessions', JSON.stringify(deletedDefaults));
      }
      return;
    }

    const saved = localStorage.getItem('public_confessions');
    if (saved) {
      let parsed = JSON.parse(saved) as PublicConfession[];
      parsed = parsed.filter(item => item.id !== id);
      localStorage.setItem('public_confessions', JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Error deleting confession from localStorage:', e);
  }
};
