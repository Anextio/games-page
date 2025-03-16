import { GameType } from '@/types/game'

// For now, we'll use a small list of words. In production, you'd want a much larger list
const WORD_LIST = {
  classic: [
    'REACT', 'REDUX', 'HOOKS', 'STATE', 'PROPS',
    'QUERY', 'FETCH', 'ASYNC', 'AWAIT', 'CLASS',
    'STYLE', 'ROUTE', 'MODAL', 'FORMS', 'INPUT',
    'CLICK', 'HOVER', 'FOCUS', 'BLOCK', 'FLOAT'
  ],
  numbers: [
    '1234', '5678', '9012', '3456', '7890',
    '2468', '1357', '0246', '1379', '4680'
  ],
  speed: [
    'FAST', 'RUSH', 'DASH', 'ZOOM', 'RACE',
    'BOLT', 'JUMP', 'LEAP', 'SKIP', 'MOVE'
  ],
  double: [
    ['BREAD', 'BUTTER'],
    ['PEANUT', 'JELLY'],
    ['SALT', 'PEPPER'],
    ['FISH', 'CHIPS'],
    ['ROCK', 'ROLL']
  ],
  // New game types
  hard: [
    'PYTHON', 'CODING', 'GITHUB', 'NODEJS', 'SERVER',
    'DESIGN', 'LAMBDA', 'OBJECT', 'RENDER', 'DOCKER',
    'CANVAS', 'KEYMAP', 'SYNTAX', 'MATRIX', 'WIDGET'
  ],
  definition: [
    { word: 'CLOUD', definition: 'A visible mass of condensed water vapor floating in the atmosphere' },
    { word: 'BEACH', definition: 'A shore of a body of water covered by sand, pebbles, or rocks' },
    { word: 'MONEY', definition: 'A medium of exchange in the form of coins and banknotes' },
    { word: 'PLANT', definition: 'A living organism of the kind exemplified by trees, shrubs, herbs, etc.' },
    { word: 'NIGHT', definition: 'The period of darkness in each 24 hours' }
  ],
  chain: [
    'START', 'TANGO', 'ONION', 'NOISE', 'ELDER',
    'ROSES', 'SMILE', 'EARTH', 'HOUSE', 'ENJOY'
  ],
  backwards: [
    'LEVEL', 'RADAR', 'REFER', 'MADAM', 'KAYAK',
    'CIVIC', 'ROTOR', 'SOLOS', 'TENET', 'RACECAR'
  ],
  // New crosswordle themes with related words
  crosswordle: [
    {
      theme: 'Planets',
      words: [
        { word: 'EARTH', clue: 'The blue planet' },
        { word: 'VENUS', clue: 'Named after goddess of love' },
        { word: 'MARS', clue: 'The red planet' },
        { word: 'PLUTO', clue: 'Dwarf planet since 2006' },
        { word: 'SATURN', clue: 'Has many rings' }
      ]
    },
    {
      theme: 'Fruits',
      words: [
        { word: 'APPLE', clue: 'Keeps the doctor away' },
        { word: 'GRAPE', clue: 'Used to make wine' },
        { word: 'LEMON', clue: 'Sour citrus fruit' },
        { word: 'MELON', clue: 'Sweet summer fruit' },
        { word: 'PEACH', clue: 'Fuzzy skin fruit' }
      ]
    },
    {
      theme: 'Colors',
      words: [
        { word: 'BLACK', clue: 'Absence of color' },
        { word: 'GREEN', clue: 'Color of grass' },
        { word: 'WHITE', clue: 'Color of snow' },
        { word: 'BROWN', clue: 'Color of chocolate' },
        { word: 'PURPLE', clue: 'Royal color' }
      ]
    }
  ],
  // Words for waffle (all 5-letter words)
  waffle: [
    'APPLE', 'BAKER', 'CHAIR', 'DANCE', 'EARTH',
    'FLAME', 'GRACE', 'HEART', 'IVORY', 'JELLY',
    'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN',
    'PEACE', 'QUIET', 'RIVER', 'SMILE', 'TABLE'
  ]
}

// Dictionary for word definitions (for Definition mode)
export const WORD_DEFINITIONS: Record<string, string> = {}
// Populate the definitions dictionary
WORD_LIST.definition.forEach(item => {
  if (typeof item === 'object' && 'word' in item && 'definition' in item) {
    WORD_DEFINITIONS[(item as any).word.toLowerCase()] = (item as any).definition
  }
})

export function getRandomWord(gameType: GameType = 'classic'): string | string[] {
  const words = WORD_LIST[gameType]
  
  if (gameType === 'double' && Array.isArray(words[0])) {
    // For double mode, return a pair of related words
    return words[Math.floor(Math.random() * words.length)] as string[]
  }
  
  if (gameType === 'crosswordle') {
    // For crosswordle, return a random theme
    return (words[Math.floor(Math.random() * words.length)] as any).theme
  }
  
  // For all other game types
  return words[Math.floor(Math.random() * words.length)] as string
}

export function getWordDefinition(word: string): string {
  return WORD_DEFINITIONS[word.toLowerCase()] || 'Definition not available'
}

export function formatGuess(guess: string, gameType: GameType): string {
  // Format the guess based on game type
  const formattedGuess = guess.toLowerCase()
  
  // For backwards mode, reverse the word
  if (gameType === 'backwards') {
    return formattedGuess.split('').reverse().join('')
  }
  
  return formattedGuess
}

export function isValidChainGuess(previousGuess: string, currentGuess: string): boolean {
  if (!previousGuess) return true // First guess in chain is always valid
  
  const lastChar = previousGuess.charAt(previousGuess.length - 1).toLowerCase()
  const firstChar = currentGuess.charAt(0).toLowerCase()
  
  return lastChar === firstChar
}

// Get crossword data for a specific theme
export function getCrosswordData(theme: string) {
  const themeData = (WORD_LIST.crosswordle as any[]).find(item => item.theme === theme)
  if (!themeData) return null
  
  return {
    theme: themeData.theme,
    words: themeData.words
  }
}

// Generate a random waffle grid
export function generateWaffleGrid(size = 3) {
  // We'll use the waffle word list to create a grid
  const words = WORD_LIST.waffle
  
  // For a 3x3 grid, we need 3 horizontal and 3 vertical words (all 5 letters)
  const horizontalWords: string[] = []
  const verticalWords: string[] = []
  
  // Select random words
  while (horizontalWords.length < size) {
    const randomIndex = Math.floor(Math.random() * words.length)
    const word = words[randomIndex]
    if (!horizontalWords.includes(word)) {
      horizontalWords.push(word)
    }
  }
  
  while (verticalWords.length < size) {
    const randomIndex = Math.floor(Math.random() * words.length)
    const word = words[randomIndex]
    if (!verticalWords.includes(word) && !horizontalWords.includes(word)) {
      verticalWords.push(word)
    }
  }
  
  return {
    horizontalWords,
    verticalWords,
    size
  }
}

// Fixed implementation of getGuessStatuses to properly handle duplicate letters
export function getGuessStatuses(guessWord: string, solutionWord: string): ('correct' | 'present' | 'absent')[] {
  const statuses: ('correct' | 'present' | 'absent')[] = Array(guessWord.length).fill('absent')
  
  // Convert solution to array and make a copy we can modify
  const solutionChars = [...solutionWord.toLowerCase()]
  const guessChars = [...guessWord.toLowerCase()]
  
  // First pass: Find exact matches (correct positions)
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === solutionChars[i]) {
      statuses[i] = 'correct'
      solutionChars[i] = '#' // Mark as used
    }
  }
  
  // Second pass: Find misplaced letters
  for (let i = 0; i < guessChars.length; i++) {
    if (statuses[i] !== 'correct') {
      const letterIndex = solutionChars.indexOf(guessChars[i])
      if (letterIndex !== -1) {
        statuses[i] = 'present'
        solutionChars[letterIndex] = '#' // Mark as used
      }
    }
  }
  
  return statuses
} 