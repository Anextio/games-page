'use client'

import React, { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import VictoryAnimation from '@/components/VictoryAnimation'
import PuzzleSelector from '@/components/PuzzleSelector'
import useGame from '@/hooks/useGame'
import usePuzzleHistory from '@/hooks/usePuzzleHistory'
import { GameConfig } from '@/types/game'
import { CLASSIC_WORDS } from '@/data/wordLists'

const classicConfig: GameConfig = {
  type: 'classic',
  wordLength: 5,
  maxAttempts: 6
}

const TUTORIAL_SHOWN_KEY = 'classic-tutorial-shown'

export default function ClassicWordle() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [showPuzzleSelector, setShowPuzzleSelector] = useState(false)
  
  // Use the puzzle history hook
  const {
    currentPuzzle,
    formattedDate,
    availablePuzzles,
    markCompleted,
    loadPuzzle
  } = usePuzzleHistory('classic', CLASSIC_WORDS.length)
  
  // Get today's solution based on the puzzle number
  const solution = CLASSIC_WORDS[(currentPuzzle.number - 1) % CLASSIC_WORDS.length]
  
  // Initialize the game with the puzzle's solution
  const { gameState, usedKeys, onKeyPress, errorMessage } = useGame({
    ...classicConfig,
    solution
  })

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SHOWN_KEY)
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
  }, [])
  
  // Mark puzzle as completed when game is won
  useEffect(() => {
    if (gameState.gameStatus === 'won' && currentPuzzle.number) {
      markCompleted(currentPuzzle.number)
    }
  }, [gameState.gameStatus, currentPuzzle.number, markCompleted])
  
  // Handle selecting a puzzle from the selector
  const handleSelectPuzzle = (puzzleNumber: number, date: string) => {
    loadPuzzle(puzzleNumber, date)
    setShowPuzzleSelector(false)
    // Force reload to reset the game with the new solution
    window.location.reload()
  }

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        onKeyPress('BACKSPACE')
      } else if (/^[A-Za-z]$/.test(e.key)) {
        onKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [onKeyPress])

  // Format usedKeys for the keyboard component
  const formatKeyboardStatuses = () => {
    const statuses: Record<string, 'correct' | 'present' | 'absent' | 'unused'> = {};
    
    // Add the alphabet
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      statuses[letter] = usedKeys[letter] || 'unused';
    });
    
    return statuses;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
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
          <h1 className="text-3xl font-bold">Classic Wordle</h1>
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
      
      <div className="text-center mb-4 w-full">
        <h2 className="text-lg font-medium">Classic Wordle #{currentPuzzle.number}</h2>
        <p className="text-sm text-gray-600">{formattedDate}</p>
      </div>
      
      <div className="flex flex-col items-center w-full">
        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          solution={gameState.solution}
          maxAttempts={gameState.maxTurns}
          wordLength={classicConfig.wordLength}
        />

        <Keyboard
          onKey={(key) => onKeyPress(key)}
          onEnter={() => onKeyPress('ENTER')}
          onDelete={() => onKeyPress('BACKSPACE')}
          letterStatuses={formatKeyboardStatuses()}
        />
      </div>

      {gameState.gameStatus !== 'playing' && (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {gameState.gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}
          </h2>
          <p className="text-lg">
            {gameState.gameStatus === 'won'
              ? `You won in ${gameState.turn} turns!`
              : `The word was: ${gameState.solution}`}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <Tutorial
        gameType="classic"
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <Toast
        message={errorMessage || ''}
        isVisible={!!errorMessage}
        onHide={() => {}}
        type="error"
      />

      <VictoryAnimation isVisible={gameState.gameStatus === 'won'} />
      
      <PuzzleSelector
        isOpen={showPuzzleSelector}
        onClose={() => setShowPuzzleSelector(false)}
        puzzles={availablePuzzles}
        currentPuzzleNumber={currentPuzzle.number}
        onSelectPuzzle={handleSelectPuzzle}
        gameType="Classic"
      />
    </div>
  )
} 