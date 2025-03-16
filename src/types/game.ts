export type GameType = 'classic' | 'speed' | 'double' | 'hard' | 'chain' | 'backwards' | 'crosswordle' | 'waffle'

export interface GameConfig {
  type: GameType
  wordLength: number
  maxAttempts: number
  timeLimit?: number
  definition?: string
  previousGuess?: string
  theme?: string  // For crosswordle theme
  gridSize?: number // For waffle size
  solution?: string // Allow passing a specific solution
}

// For Crosswordle
export interface CrosswordCell {
  row: number
  col: number
  value: string
  isRevealed: boolean
}

export interface CrosswordWord {
  word: string
  clue: string
  startRow: number
  startCol: number
  direction: 'across' | 'down'
  cells: CrosswordCell[]
}

export interface CrosswordGrid {
  words: CrosswordWord[]
  theme: string
  size: number
}

// For Waffle
export interface WaffleCell {
  row: number
  col: number
  value: string
  isFixed: boolean
  originalIndex?: number
}

export interface WaffleGrid {
  cells: WaffleCell[][]
  size: number
  words: {
    horizontal: string[]
    vertical: string[]
  }
}

export interface GameState {
  guesses: string[]
  currentGuess: string
  solution: string
  gameStatus: 'playing' | 'won' | 'lost'
  turn: number
  maxTurns: number
}

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: { [key: number]: number }
  lastPlayed: Date | null
}

export interface GameSettings {
  hardMode: boolean
  darkMode: boolean
  highContrastMode: boolean
} 