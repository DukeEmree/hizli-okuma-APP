export type ExerciseCategory = 'reading' | 'comprehension' | 'vision' | 'memory' | 'focus';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ExerciseConfig {
  initialDifficulty?: DifficultyLevel;
  durationMs?: number; // Sabit süreli egzersizler için
  targetWords?: number; // Kelime hedefine dayalı egzersizler için
  adaptiveDifficulty?: boolean; // Performansa göre zorluk artsın mı?
  updateIntervalMs?: number; // Timer tetiklenme sıklığı
  [key: string]: any; // Egzersize özel ek konfigürasyonlar (örn: rsvp chunk size)
}

export interface ExerciseDefinition {
  id: string;
  type: string;
  category: ExerciseCategory;
  nameKey: string; // i18n translation key (örn: 'exercises.rsvp.name')
  descriptionKey: string; // i18n translation key
  defaultConfig: ExerciseConfig;
  isPremium?: boolean; // Premium durumu
}

export type SessionState = 'idle' | 'running' | 'paused' | 'completed' | 'abandoned';

export interface ExerciseSession {
  id: string; // clientSessionId
  exerciseId: string;
  exerciseType: string;
  state: SessionState;
  startedAt: number | null;
  completedAt: number | null;
  pausedAt: number | null;
  totalPausedDurationMs: number;
  currentDifficulty: DifficultyLevel;
  config: ExerciseConfig;
}

export interface ExerciseMetrics {
  reactionTimeMs?: number[];
  errorCount?: number;
  correctCount?: number;
  completionRate?: number; // 0-1 arası (bitirme oranı)
  wpm?: number; // Okuma hızı egzersizleri için
  comprehensionScore?: number; // Anlama skor yüzdesi (0-100)
  comprehensionAccuracy?: number; // 0-1 arası doğru cevap oranı
  [key: string]: any; // Egzersize özel diğer metrikler
}

export interface ExerciseScore {
  rawScore: number;
  accuracy: number; // 0-1 arası (doğruluk yüzdesi)
  speedBonus?: number;
  difficultyMultiplier: number;
  finalScore: number;
}

export interface ExerciseResult {
  exerciseId: string;
  exerciseType: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  difficulty: DifficultyLevel;
  score: ExerciseScore;
  metrics: ExerciseMetrics;
  algorithmVersion: number;
}

export interface ProgressionState {
  currentLevel: DifficultyLevel;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  historicalBest: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'main_idea' | 'detail' | 'inference';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[]; // true_false için ['Doğru', 'Yanlış'] olabilir
  correctAnswerIndex: number;
  explanation?: string;
}

export interface ReadingText {
  id: string;
  language: string;
  title: string;
  content: string;
  difficulty: DifficultyLevel;
  estimatedReadingTime?: number; // Saniye cinsinden
  tags?: string[];
  questions: Question[];
}
