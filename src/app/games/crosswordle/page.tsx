"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import PuzzleSelector from '@/components/PuzzleSelector'
import { validateWordWithCache } from '@/utils/wordValidation'
import { format, differenceInDays, subDays, parseISO, formatISO } from 'date-fns'
import puzzleData from '@/data/crosswordlePuzzles.json'
import usePuzzleHistory from '@/hooks/usePuzzleHistory'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'

const TUTORIAL_SHOWN_KEY = 'crosswordle-tutorial-shown'
const _COMPLETED_PUZZLES_KEY = 'crosswordle-completed-puzzles'
const _CURRENT_PUZZLE_KEY = 'crosswordle-current-puzzle'

// Color codes for feedback
const COLORS = {
  correct: 'bg-green-500 text-white',           // Right letter, right position
  present: 'bg-yellow-400 text-white',          // Right letter, wrong position
  otherWord: 'bg-orange-500 text-white',        // Letter is in the other crossing word
  absent: 'bg-gray-400 text-white',             // Letter not in either word
  default: 'bg-gray-300',                       // Default state (no feedback yet)
  empty: 'bg-transparent border border-gray-400', // Empty cell in the grid
  selected: 'border-2 border-blue-600'          // Currently selected position
}

export default function Crosswordle() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [horizontalWord, setHorizontalWord] = useState('')
  const [verticalWord, setVerticalWord] = useState('')
  const [relation, setRelation] = useState('')
  const [horizontalGuess, setHorizontalGuess] = useState('')
  const [verticalGuess, setVerticalGuess] = useState('')
  const [guesses, setGuesses] = useState<Array<{horizontal: string, vertical: string}>>([])
  const [feedback, setFeedback] = useState<{[key: string]: {horizontal: string[], vertical: string[]}}>({}); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, _setShowHint] = useState(true)
  const [activeOrientation, setActiveOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showPuzzleSelector, setShowPuzzleSelector] = useState(false)
  const [horizontalGuesses, setHorizontalGuesses] = useState<string[]>([])
  const [verticalGuesses, setVerticalGuesses] = useState<string[]>([])
  
  const wordLength = 5
  
  // Use the custom puzzle history hook
  const {
    currentPuzzle,
    formattedDate,
    availablePuzzles,
    markCompleted,
    loadPuzzle
  } = usePuzzleHistory('crosswordle', puzzleData.puzzles.length)
  
  // Keep track of which letters have been used and their status
  const [letterStatuses, setLetterStatuses] = useState<Record<string, 'correct' | 'present' | 'otherWord' | 'absent' | 'unused'>>({});
  
  // Initialize the game
  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SHOWN_KEY)
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
    
    // Find the puzzle to load based on the current puzzle number
    const puzzle = puzzleData.puzzles.find(p => p.id === currentPuzzle.number)
    
    if (puzzle) {
      setHorizontalWord(puzzle.horizontal.toUpperCase())
      setVerticalWord(puzzle.vertical.toUpperCase())
      setRelation(puzzle.relation)
    } else {
      // Fallback to first puzzle if no match found
      const fallbackPuzzle = puzzleData.puzzles[0]
      setHorizontalWord(fallbackPuzzle.horizontal.toUpperCase())
      setVerticalWord(fallbackPuzzle.vertical.toUpperCase())
      setRelation(fallbackPuzzle.relation)
    }
  }, [currentPuzzle])
  
  // Mark puzzle as completed when game is won
  useEffect(() => {
    if (gameCompleted && currentPuzzle.number) {
      markCompleted(currentPuzzle.number)
    }
  }, [gameCompleted, currentPuzzle.number, markCompleted])
  
  // Handle selecting a puzzle from the selector
  const handleSelectPuzzle = (puzzleNumber: number, date: string) => {
    loadPuzzle(puzzleNumber, date)
    setShowPuzzleSelector(false)
    
    // Reset game state
    setGuesses([])
    setFeedback({})
    setHorizontalGuess('')
    setVerticalGuess('')
    setGameCompleted(false)
    setGameStarted(false)
    setActiveOrientation('horizontal')
  }
  
  // Find the intersection point of the two words
  const findIntersection = () => {
    if (!horizontalWord || !verticalWord) return { horizontal: 2, vertical: 2 }
    
    for (let i = 0; i < horizontalWord.length; i++) {
      for (let j = 0; j < verticalWord.length; j++) {
        if (horizontalWord[i] === verticalWord[j]) {
          return { horizontal: i, vertical: j }
        }
      }
    }
    // Default to middle if no intersection
    return { horizontal: 2, vertical: 2 }
  }
  
  const intersection = findIntersection()
  
  // Show error message
  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 2000)
  }
  
  // Handle key press
  const handleKeyPress = (key: string) => {
    if (gameCompleted) return
    
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      if (activeOrientation === 'horizontal') {
        if (horizontalGuess.length > 0) {
          setHorizontalGuess(prev => prev.slice(0, -1))
        }
      } else {
        if (verticalGuess.length > 0) {
          setVerticalGuess(prev => prev.slice(0, -1))
        } else if (horizontalGuess.length > 0) {
          // If vertical is empty, go back to horizontal
          setActiveOrientation('horizontal')
          setHorizontalGuess(prev => prev.slice(0, -1))
        }
      }
    } else if (key === 'Tab') {
      // Toggle between horizontal and vertical on Tab press
      setActiveOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
    } else if (/^[A-Z]$/.test(key)) {
      if (activeOrientation === 'horizontal') {
        if (horizontalGuess.length < wordLength) {
          const newGuess = horizontalGuess + key
          setHorizontalGuess(newGuess)
          // Automatically switch to vertical when horizontal is full
          if (newGuess.length === wordLength) {
            setActiveOrientation('vertical')
          }
        }
      } else { // vertical
        if (verticalGuess.length < wordLength) {
          setVerticalGuess(prev => prev + key)
        }
      }
    }
  }
  
  // Count letter occurrences in a word
  const countLetters = (word: string) => {
    const counts: {[key: string]: number} = {}
    for (const letter of word) {
      counts[letter] = (counts[letter] || 0) + 1
    }
    return counts
  }
  
  // Provide feedback for a guess against a target word
  const getFeedback = (guess: string, targetWord: string, otherWord: string) => {
    // Create a map to track occurrences of each letter in the target word
    const targetLetters = countLetters(targetWord)
    const otherLetters = countLetters(otherWord)
    
    // First pass: mark correct positions and decrease letter counts
    const result: string[] = Array(guess.length).fill(COLORS.absent)
    const usedPositions: {[key: number]: boolean} = {}
    const usedLetters: {[key: string]: number} = {}
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      if (letter === targetWord[i]) {
        result[i] = COLORS.correct
        usedPositions[i] = true
        usedLetters[letter] = (usedLetters[letter] || 0) + 1
      }
    }
    
    // Second pass: mark present and other word letters
    for (let i = 0; i < guess.length; i++) {
      if (usedPositions[i]) continue
      
      const letter = guess[i]
      
      // Check if this letter exists in the target word and we haven't used all instances
      if (targetLetters[letter] && (usedLetters[letter] || 0) < targetLetters[letter]) {
        result[i] = COLORS.present
        usedLetters[letter] = (usedLetters[letter] || 0) + 1
      } 
      // Check if it's in the other word
      else if (otherLetters[letter]) {
        result[i] = COLORS.otherWord
      }
    }
    
    return result
  }
  
  // Submit a guess
  const submitGuess = async () => {
    // Check if both guesses are complete
    if (horizontalGuess.length !== wordLength || verticalGuess.length !== wordLength) {
      showError(`Both words must be ${wordLength} letters long`)
      return
    }
    
    // Validate both are real words
    const horizontalValidation = await validateWordWithCache(horizontalGuess, wordLength)
    const verticalValidation = await validateWordWithCache(verticalGuess, wordLength)
    
    if (!horizontalValidation.isValid) {
      showError(`Horizontal word: ${horizontalValidation.message || 'Not a valid word'}`)
      return
    }
    
    if (!verticalValidation.isValid) {
      showError(`Vertical word: ${verticalValidation.message || 'Not a valid word'}`)
      return
    }
    
    // Get feedback for both guesses
    const horizontalFeedback = getFeedback(horizontalGuess, horizontalWord, verticalWord)
    const verticalFeedback = getFeedback(verticalGuess, verticalWord, horizontalWord)
    
    // Update guesses and feedback
    const newGuess = { horizontal: horizontalGuess, vertical: verticalGuess }
    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)
    
    const guessKey = `${horizontalGuess}-${verticalGuess}`
    const newFeedback = { ...feedback }
    newFeedback[guessKey] = {
      horizontal: horizontalFeedback,
      vertical: verticalFeedback
    }
    
    setFeedback(newFeedback)
    
    // Reset current guesses and go back to horizontal
    setHorizontalGuess('')
    setVerticalGuess('')
    setActiveOrientation('horizontal')
    
    // Check if the game is completed (both words are correct)
    if (horizontalGuess === horizontalWord && verticalGuess === verticalWord) {
      setGameCompleted(true)
    }
    
    if (!gameStarted) {
      setGameStarted(true)
    }
  }
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE')
      } else if (e.key === 'Tab') {
        // Toggle between horizontal and vertical on Tab press
        e.preventDefault() // Prevent default tab behavior
        setActiveOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    const handleKeydown = (e: KeyboardEvent) => {
      // Prevent Tab from changing focus
      if (e.key === 'Tab') {
        e.preventDefault()
      }
    }

    window.addEventListener('keyup', handleKeyup)
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keyup', handleKeyup)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [horizontalGuess, verticalGuess, activeOrientation, gameCompleted])
  
  // Render the crossword grid
  const renderCrosswordGrid = () => {
    // Calculate horizontal row and vertical column positions
    const horizontalRow = intersection.vertical
    const verticalCol = intersection.horizontal
    
    // Create a representation of which cells should be active
    const activeCells: {[key: string]: boolean} = {}
    
    // Mark horizontal word cells as active
    for (let i = 0; i < wordLength; i++) {
      activeCells[`${horizontalRow}-${i}`] = true
    }
    
    // Mark vertical word cells as active
    for (let i = 0; i < wordLength; i++) {
      activeCells[`${i}-${verticalCol}`] = true
    }
    
    // Render the grid
    return (
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Orientation indicator */}
          <div className="flex justify-center mb-4 text-sm w-full">
            <div 
              className={`px-4 py-2 mx-1 rounded-t font-medium cursor-pointer ${
                activeOrientation === 'horizontal' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveOrientation('horizontal')}
            >
              Horizontal
            </div>
            <div 
              className={`px-4 py-2 mx-1 rounded-t font-medium cursor-pointer ${
                activeOrientation === 'vertical' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveOrientation('vertical')}
            >
              Vertical
            </div>
          </div>
          
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${wordLength}, 3rem)`,
            gridTemplateRows: `repeat(${wordLength}, 3rem)`,
            gap: '0.25rem'
          }}>
            {Array(wordLength).fill(null).map((_, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {Array(wordLength).fill(null).map((_, colIndex) => {
                  // Check if this is part of the crossword pattern
                  const isHorizontalRow = rowIndex === intersection.vertical
                  const isVerticalCol = colIndex === intersection.horizontal
                  const isActive = isHorizontalRow || isVerticalCol
                  
                  // Get the current input position based on active orientation
                  const currentHorizontalPosition = colIndex === horizontalGuess.length && isHorizontalRow
                  const currentVerticalPosition = rowIndex === verticalGuess.length && isVerticalCol
                  
                  const isCurrentInput = 
                    (activeOrientation === 'horizontal' && currentHorizontalPosition) ||
                    (activeOrientation === 'vertical' && currentVerticalPosition)
                    
                  const isActiveWord = 
                    (activeOrientation === 'horizontal' && isHorizontalRow) ||
                    (activeOrientation === 'vertical' && isVerticalCol)
                  
                  const isFocused = isCurrentInput && !gameCompleted
                  
                  // Get the letter to display
                  let displayLetter = ''
                  
                  if (gameCompleted && isActive) {
                    // Show solution when game is completed
                    displayLetter = isHorizontalRow ? horizontalWord[colIndex] : verticalWord[rowIndex]
                  } else if (isActive) {
                    // For horizontal row
                    if (isHorizontalRow) {
                      if (colIndex < horizontalGuess.length) {
                        displayLetter = horizontalGuess[colIndex]
                      }
                    }
                    // For vertical column
                    else if (isVerticalCol) {
                      if (rowIndex < verticalGuess.length) {
                        displayLetter = verticalGuess[rowIndex]
                      }
                    }
                  }
                  
                  // Style based on whether it's part of the crossword
                  const cellClass = `
                    w-12 h-12 flex items-center justify-center text-xl font-bold 
                    ${isActive ? (displayLetter ? 'bg-gray-400 text-black' : COLORS.empty) : 'invisible'}
                    ${isFocused ? 'border-blue-600 border-2' : ''}
                    ${isCurrentInput ? 'border-blue-600 border-2 bg-white' : ''}
                    ${isActiveWord ? 'ring-2 ring-blue-300' : ''}
                  `
                  
                  return (
                    <div 
                      key={`cell-${rowIndex}-${colIndex}`} 
                      className={cellClass}
                      onClick={() => isActive && !gameCompleted && focusInput()}
                    >
                      {displayLetter}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Hidden input for keyboard focus */}
          <input
            type="text"
            ref={inputRef}
            className="opacity-0 absolute -left-full"
            value={activeOrientation === 'horizontal' ? horizontalGuess : verticalGuess}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[A-Z]*$/.test(input)) {
                if (activeOrientation === 'horizontal') {
                  if (input.length <= wordLength) {
                    setHorizontalGuess(input);
                    // Auto switch to vertical when horizontal is complete
                    if (input.length === wordLength) {
                      setActiveOrientation('vertical');
                    }
                  }
                } else {
                  if (input.length <= wordLength) {
                    setVerticalGuess(input);
                  }
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitGuess();
              }
            }}
            maxLength={wordLength}
            autoFocus
          />
        </div>
      </div>
    )
  }
  
  // Add a ref for the hidden input
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Focus the input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
  
  // Render compact feedback for latest guess
  const _renderCompactFeedback = () => {
    if (guesses.length === 0) return null
    
    // Get the most recent guess
    const latestGuess = guesses[guesses.length - 1]
    const guessKey = `${latestGuess.horizontal}-${latestGuess.vertical}`
    const latestFeedback = feedback[guessKey]
    
    if (!latestFeedback) return null
    
    return (
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-center">Feedback for Guess #{guesses.length}</h3>
        
        <div className="flex flex-col space-y-4">
          {/* Horizontal word feedback */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">Horizontal: {latestGuess.horizontal}</div>
            <div className="flex justify-center">
              {Array(wordLength).fill(null).map((_, i) => (
                <div 
                  key={`h-compact-${i}`}
                  className={`w-10 h-10 flex items-center justify-center font-bold m-1 ${latestFeedback.horizontal[i]}`}
                >
                  {latestGuess.horizontal[i]}
                </div>
              ))}
            </div>
          </div>
          
          {/* Vertical word feedback */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">Vertical: {latestGuess.vertical}</div>
            <div className="flex justify-center">
              {Array(wordLength).fill(null).map((_, i) => (
                <div 
                  key={`v-compact-${i}`}
                  className={`w-10 h-10 flex items-center justify-center font-bold m-1 ${latestFeedback.vertical[i]}`}
                >
                  {latestGuess.vertical[i]}
                </div>
              ))}
            </div>
          </div>
          
          {/* Simple color key */}
          <div className="flex justify-center mt-2 text-xs text-gray-600">
            <div className="flex items-center mx-2">
              <div className={`w-3 h-3 ${COLORS.correct} mr-1`}></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center mx-2">
              <div className={`w-3 h-3 ${COLORS.present} mr-1`}></div>
              <span>Wrong position</span>
            </div>
            <div className="flex items-center mx-2">
              <div className={`w-3 h-3 ${COLORS.otherWord} mr-1`}></div>
              <span>In other word</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Update letter statuses based on feedback
  useEffect(() => {
    if (guesses.length === 0) return;

    const newStatuses = { ...letterStatuses };
    const latestGuess = guesses[guesses.length - 1];
    const latestFeedback = feedback[guesses.length - 1];

    if (!latestFeedback) return;

    // Update horizontal word statuses
    latestGuess.horizontal.split('').forEach((letter, index) => {
      const status = latestFeedback.horizontal[index].includes('bg-green') 
        ? 'correct' 
        : latestFeedback.horizontal[index].includes('bg-yellow') 
          ? 'present' 
          : latestFeedback.horizontal[index].includes('bg-orange')
            ? 'otherWord'
            : 'absent';
      
      const upperLetter = letter.toUpperCase();
      
      // Only update if the new status is better than the existing one
      if (
        !newStatuses[upperLetter] || 
        status === 'correct' ||
        (status === 'present' && newStatuses[upperLetter] === 'absent') ||
        (status === 'otherWord' && newStatuses[upperLetter] === 'absent')
      ) {
        newStatuses[upperLetter] = status;
      }
    });

    // Update vertical word statuses
    latestGuess.vertical.split('').forEach((letter, index) => {
      const status = latestFeedback.vertical[index].includes('bg-green') 
        ? 'correct' 
        : latestFeedback.vertical[index].includes('bg-yellow') 
          ? 'present' 
          : latestFeedback.vertical[index].includes('bg-orange')
            ? 'otherWord'
            : 'absent';
      
      const upperLetter = letter.toUpperCase();
      
      // Only update if the new status is better than the existing one
      if (
        !newStatuses[upperLetter] || 
        status === 'correct' ||
        (status === 'present' && newStatuses[upperLetter] === 'absent') ||
        (status === 'otherWord' && newStatuses[upperLetter] === 'absent')
      ) {
        newStatuses[upperLetter] = status;
      }
    });

    setLetterStatuses(newStatuses);
  }, [guesses, feedback]);

  // Virtual keyboard for mobile users
  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ]
    
    const getKeyClass = (key: string) => {
      if (key === 'ENTER' || key === 'BACKSPACE') {
        return 'bg-blue-500 text-white px-3';
      }
      
      const status = letterStatuses[key] || 'unused';
      switch (status) {
        case 'correct':
          return 'bg-green-600 text-white';
        case 'present':
          return 'bg-yellow-500 text-white';
        case 'otherWord':
          return 'bg-orange-500 text-white';
        case 'absent':
          return 'bg-gray-600 text-white';
        default:
          return 'bg-gray-200 hover:bg-gray-300';
      }
    };
    
    return (
      <div className="mb-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2">
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`px-2 py-3 mx-1 rounded font-bold ${getKeyClass(key)} ${
                  key !== 'ENTER' && key !== 'BACKSPACE' ? 'w-10' : ''
                }`}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  }
  
  // Generate share text
  const generateShareText = () => {
    const emoji = {
      correct: '🟩',
      present: '🟨',
      otherWord: '🟧',
      absent: '⬜'
    }
    
    const date = format(new Date(), 'yyyy-MM-dd')
    let shareText = `Crosswordle #${currentPuzzle.number} (${date}) - ${guesses.length}/6\n\n`
    
    // Get the last guess feedback
    const latestGuess = guesses[guesses.length - 1]
    const guessKey = `${latestGuess.horizontal}-${latestGuess.vertical}`
    const latestFeedback = feedback[guessKey]
    
    if (latestFeedback) {
      // Add horizontal feedback
      shareText += 'Horizontal: '
      latestFeedback.horizontal.forEach(color => {
        if (color === COLORS.correct) shareText += emoji.correct
        else if (color === COLORS.present) shareText += emoji.present
        else if (color === COLORS.otherWord) shareText += emoji.otherWord
        else shareText += emoji.absent
      })
      
      shareText += '\nVertical: '
      latestFeedback.vertical.forEach(color => {
        if (color === COLORS.correct) shareText += emoji.correct
        else if (color === COLORS.present) shareText += emoji.present
        else if (color === COLORS.otherWord) shareText += emoji.otherWord
        else shareText += emoji.absent
      })
    }
    
    // Add URL
    shareText += '\n\nPlay at: [your-url-here]'
    
    return shareText
  }
  
  // Handle share button click
  const handleShare = async () => {
    const shareText = generateShareText()
    
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crosswordle Results',
          text: shareText
        })
      } catch (err) {
        console.error('Error sharing:', err)
        // Fallback to clipboard
        copyToClipboard(shareText)
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText)
    }
  }
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => {
        console.error('Could not copy text: ', err)
      })
  }
  
  return (
    <div className="px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 text-gray-600 hover:text-gray-900 mr-2"
            aria-label="Go back to games"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">Crosswordle #{currentPuzzle.number}</h1>
        </div>
        <div className="flex">
          <button
            onClick={() => setShowPuzzleSelector(true)}
            className="p-2 text-gray-600 hover:text-gray-900 mr-2"
            aria-label="Select Puzzle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="text-center mb-4 w-full max-w-md">
        <p className="text-sm text-gray-600">{formattedDate}</p>
        {relation && showHint && <p className="mt-2 text-sm bg-blue-100 p-2 rounded">Hint: {relation}</p>}
      </div>

      {/* Game content */}
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Keep the render functions and interactive elements from the original */}
        {renderCrosswordGrid()}
        {renderKeyboard()}
      </div>

      {gameCompleted && (
        <div className="mt-8 w-full max-w-md text-center">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Puzzle Completed!</h2>
            <p className="mb-4">
              You solved both words in {guesses.length} guesses!
            </p>
            <p className="mb-4">
              <strong>Horizontal:</strong> {horizontalWord.toUpperCase()} <br />
              <strong>Vertical:</strong> {verticalWord.toUpperCase()} <br />
              <strong>Connection:</strong> {relation}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleShare}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copySuccess ? 'Copied!' : 'Share Results'}
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Tutorial
        gameType="crosswordle"
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <Toast
        message={errorMessage || ''}
        isVisible={!!errorMessage}
        onHide={() => {}}
        type="error"
      />
      
      {/* Use the reusable PuzzleSelector component */}
      <PuzzleSelector
        isOpen={showPuzzleSelector}
        onClose={() => setShowPuzzleSelector(false)}
        puzzles={availablePuzzles}
        currentPuzzleNumber={currentPuzzle.number}
        onSelectPuzzle={handleSelectPuzzle}
        gameType="Crosswordle"
      />
    </div>
  )
} 