import { useState, useEffect, useCallback } from 'react'
import { GameState, GameConfig, GameType } from '../types/game'
import { getRandomWord, formatGuess, getGuessStatuses, isValidChainGuess, getWordDefinition } from '../utils/words'
import { validateWordWithCache } from '../utils/wordValidation'

interface UseGameReturn {
  gameState: GameState
  usedKeys: { [key: string]: 'correct' | 'present' | 'absent' }
  onKeyPress: (key: string) => void
  errorMessage: string | null
  definition?: string // For definition mode
}

const useGame = (config: GameConfig): UseGameReturn => {
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    solution: '',
    gameStatus: 'playing',
    turn: 0,
    maxTurns: config.maxAttempts
  })

  const [usedKeys, setUsedKeys] = useState<{
    [key: string]: 'correct' | 'present' | 'absent'
  }>({})

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [definition, setDefinition] = useState<string | undefined>(undefined)

  useEffect(() => {
    // If a custom solution is provided, use it
    if (config.solution && typeof config.solution === 'string') {
      setGameState(prev => ({ ...prev, solution: config.solution as string }))
      
      // For definition mode with custom solution, get the definition
      if (config.type === 'definition' as GameType) {
        const def = getWordDefinition(config.solution)
        setDefinition(def || config.definition)
      } else if (config.definition) {
        // If definition is explicitly provided in config
        setDefinition(config.definition)
      }
      return;
    }
    
    // Otherwise get a random word
    const solution = getRandomWord(config.type)
    if (Array.isArray(solution)) {
      // Handle double word game type
      setGameState(prev => ({ ...prev, solution: solution[0] }))
    } else {
      setGameState(prev => ({ ...prev, solution }))
      
      // For definition mode, get the definition
      if (config.type === 'definition' as GameType) {
        const def = getWordDefinition(solution)
        setDefinition(def)
      }
    }
  }, [config.type, config.solution, config.definition])

  const showError = useCallback((message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 2000)
  }, [])

  const addGuess = async (guess: string) => {
    if (gameState.gameStatus !== 'playing' || isValidating) return
    
    setIsValidating(true)

    try {
      // Validate if it's a real word
      const validation = await validateWordWithCache(guess, config.wordLength)
      
      if (!validation.isValid) {
        showError(validation.message || 'Not a valid word')
        setIsValidating(false)
        return
      }
      
      // For chain mode, check if the guess starts with the last letter of the previous guess
      if (config.type === 'chain' && gameState.guesses.length > 0) {
        const lastGuess = gameState.guesses[gameState.guesses.length - 1]
        if (!isValidChainGuess(lastGuess, guess)) {
          showError(`Guess must start with "${lastGuess.charAt(lastGuess.length - 1).toUpperCase()}"`)
          setIsValidating(false)
          return
        }
      }
      
      // For backwards mode, need to check against reversed solution
      let solutionToCheck = gameState.solution
      let formattedGuess = formatGuess(guess, config.type)
      
      if (config.type === 'backwards') {
        // For backwards, we'll reverse the guess when formatting for display
        formattedGuess = [...formattedGuess].reverse().join('')
        
        // For backwards mode, we treat any valid word as correct if entered backwards
        // Instead of checking against a specific solution, we'll check if it's entered correctly
        // Note: at this point, the word has already been validated as a real word
        const reversedGuess = [...guess.toLowerCase()].reverse().join('')
        const wasEnteredBackwards = reversedGuess === guess.toLowerCase()
        
        if (wasEnteredBackwards) {
          // If the word was entered backwards, it's correct
          solutionToCheck = formattedGuess
        }
      }
      
      const newGuesses = [...gameState.guesses, formattedGuess]
      
      // Get letter statuses with proper handling of duplicates
      const statuses = getGuessStatuses(formattedGuess, solutionToCheck)
      
      // Update used keys
      const newUsedKeys = { ...usedKeys }
      formattedGuess.split('').forEach((letter, i) => {
        // Only update key status if current status is "better" than previous
        const currentStatus = statuses[i]
        const upperLetter = letter.toUpperCase()  // Ensure uppercase for keyboard
        if (
          !newUsedKeys[upperLetter] || 
          (currentStatus === 'correct') ||
          (currentStatus === 'present' && newUsedKeys[upperLetter] === 'absent')
        ) {
          newUsedKeys[upperLetter] = currentStatus
        }
      })
      setUsedKeys(newUsedKeys)

      // Update game status
      let newStatus: GameState['gameStatus'] = 'playing'
      
      // For backwards mode, any valid word entered backwards is a win
      if (config.type === 'backwards') {
        const reversedGuess = [...guess.toLowerCase()].reverse().join('')
        const wasEnteredBackwards = reversedGuess === guess.toLowerCase()
        // If the word was a valid word entered backwards, it's a win
        if (wasEnteredBackwards) {
          newStatus = 'won'
        } else if (newGuesses.length >= gameState.maxTurns) {
          newStatus = 'lost'
        }
      } else {
        // For other game types, check against solution
        const winCondition = formattedGuess === solutionToCheck;
        
        if (winCondition) {
          newStatus = 'won'
        } else if (newGuesses.length >= gameState.maxTurns) {
          newStatus = 'lost'
        }
      }

      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: newStatus,
        turn: prev.turn + 1
      }))
    } catch (error) {
      console.error('Error adding guess:', error)
      showError('An error occurred. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const onKeyPress = (key: string) => {
    if (gameState.gameStatus !== 'playing' || isValidating) return

    if (key === 'ENTER') {
      if (gameState.currentGuess.length === config.wordLength) {
        addGuess(gameState.currentGuess)
      } else {
        showError(`Word must be ${config.wordLength} letters long`)
      }
    } else if (key === 'BACKSPACE') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }))
    } else if (gameState.currentGuess.length < config.wordLength) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase()
      }))
    }
  }

  return {
    gameState,
    usedKeys,
    onKeyPress,
    errorMessage,
    definition
  }
}

export default useGame 