import { isValidWord as isWordInList } from './wordList'

// Dictionary API endpoint
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

// Cache for validated words to avoid repeated API calls
const validWordCache = new Set<string>()

// Flag to enable/disable word validation - enabled by default
let validationEnabled = true

// Function to toggle word validation
export function toggleWordValidation(enabled: boolean): void {
  validationEnabled = enabled
  console.log(`Word validation ${enabled ? 'enabled' : 'disabled'}`)
}

export async function validateWordWithCache(word: string, wordLength: number = 5): Promise<{
  isValid: boolean
  message?: string
}> {
  const normalizedWord = word.toLowerCase()

  // Return early if validation is disabled
  if (!validationEnabled) {
    return { isValid: true }
  }

  // Return early if the word is already in the cache
  if (validWordCache.has(normalizedWord)) {
    return { isValid: true }
  }

  // Validate word length
  if (word.length !== wordLength) {
    return { 
      isValid: false,
      message: `Word must be ${wordLength} letters long`
    }
  }

  // For number wordle
  if (/^\d+$/.test(word)) {
    validWordCache.add(normalizedWord)
    return { isValid: true }
  }

  try {
    // Make API call to validate the word
    const response = await fetch(`${DICTIONARY_API_URL}/${normalizedWord}`)
    
    if (response.ok) {
      // Word exists
      validWordCache.add(normalizedWord)
      return { isValid: true }
    } else {
      // Word doesn't exist in the dictionary
      return {
        isValid: false,
        message: `"${word}" is not a valid English word`
      }
    }
  } catch (error) {
    console.error('Error validating word:', error)
    // If API fails, allow the word to prevent blocking gameplay
    return { isValid: true }
  }
} 