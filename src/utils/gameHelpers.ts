import { GameConfig } from '@/types/game'
import { WORD_DEFINITIONS } from './words'

/**
 * Checks if a guess is valid for chain mode (starts with the last letter of previous guess)
 * @param guess The current guess
 * @param previousGuess The previous guess
 * @returns True if the guess is valid for chain mode, false otherwise
 */
export const isValidChainGuess = (guess: string, previousGuess: string | null): boolean => {
  // If there's no previous guess, any first guess is valid
  if (!previousGuess) return true
  
  // Get the last letter of the previous guess
  const lastLetter = previousGuess[previousGuess.length - 1].toUpperCase()
  
  // Check if the current guess starts with the last letter of the previous guess
  return guess[0].toUpperCase() === lastLetter
}

/**
 * Gets the definition for a word in definition mode
 * @param word The word to get the definition for
 * @returns The definition of the word or a default message if no definition is found
 */
export const getWordDefinition = (word: string): string => {
  return WORD_DEFINITIONS[word.toLowerCase()] || 'No definition available'
}

/**
 * Reverses a word for backwards mode
 * @param word The word to reverse
 * @returns The reversed word
 */
export const reverseWord = (word: string): string => {
  return word.split('').reverse().join('')
}

/**
 * Checks if the game is complete (all words guessed)
 * @param gameConfig The game configuration
 * @param guesses The current guesses
 * @param solution The solution(s)
 * @returns True if the game is complete, false otherwise
 */
export const isGameComplete = (
  gameConfig: GameConfig,
  guesses: string[],
  solution: string | string[]
): boolean => {
  if (gameConfig.type === 'double') {
    // For double mode, check if both words are guessed
    const solutions = solution as string[]
    return guesses.includes(solutions[0]) && guesses.includes(solutions[1])
  }
  
  // For all other modes
  return guesses.includes(solution as string)
}

/**
 * Validates if a guess meets the specific requirements for a game type
 * @param guess The current guess
 * @param gameConfig The game configuration
 * @param previousGuess The previous guess (for chain mode)
 * @returns An object with isValid flag and error message if invalid
 */
export const validateGuess = (
  guess: string,
  gameConfig: GameConfig,
  previousGuess: string | null = null
): { isValid: boolean; errorMessage?: string } => {
  // Check word length
  if (guess.length !== gameConfig.wordLength) {
    return {
      isValid: false,
      errorMessage: `Word must be ${gameConfig.wordLength} letters long`
    }
  }
  
  // Validate based on game type
  switch (gameConfig.type) {
    case 'chain':
      if (!isValidChainGuess(guess, previousGuess)) {
        const lastLetter = previousGuess ? previousGuess[previousGuess.length - 1].toUpperCase() : ''
        return {
          isValid: false,
          errorMessage: `Word must start with "${lastLetter}"`
        }
      }
      break
      
    case 'numbers':
      if (!/^\d+$/.test(guess)) {
        return {
          isValid: false,
          errorMessage: 'Guess must contain only digits'
        }
      }
      break
  }
  
  return { isValid: true }
} 