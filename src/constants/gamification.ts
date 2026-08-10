export const XP_SOURCES = {
  EXERCISE_COMPLETED: 10,
  DAILY_GOAL_COMPLETED: 50,
  STREAK_DAY: 20,
  ACHIEVEMENT_UNLOCKED: 100,
};

// Calculates required XP for a given level
// Level 1: 0
// Level 2: 100
// Level 3: 300
// Level 4: 600
// Formula: (level - 1) * (level) * 50
export const getXpThresholdForLevel = (level: number) => {
  return (level - 1) * level * 50;
};

// Determine level based on total XP
export const getLevelFromXp = (xp: number) => {
  let level = 1;
  while (xp >= getXpThresholdForLevel(level + 1)) {
    level++;
  }
  return level;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  first_exercise: {
    id: 'first_exercise',
    title: 'İlk Egzersiz',
    description: 'İlk hızlı okuma egzersizini tamamladın.',
    icon: '🎯'
  },
  streak_7: {
    id: 'streak_7',
    title: '7 Günlük Seri',
    description: '7 gün üst üste egzersiz yaptın.',
    icon: '🔥'
  },
  exercise_10: {
    id: 'exercise_10',
    title: '10 Egzersiz',
    description: 'Toplam 10 egzersiz tamamladın.',
    icon: '📚'
  },
  wpm_300: {
    id: 'wpm_300',
    title: 'Hızlı Okuyucu',
    description: 'Bir egzersizde 300 WPM hızına ulaştın.',
    icon: '⚡'
  },
  comp_90: {
    id: 'comp_90',
    title: 'Keskin Zeka',
    description: 'Bir egzersizde %90 anlama oranına ulaştın.',
    icon: '🧠'
  },
  xp_1000: {
    id: 'xp_1000',
    title: 'Usta Çırak',
    description: 'Toplam 1000 XP kazandın.',
    icon: '⭐'
  }
};
