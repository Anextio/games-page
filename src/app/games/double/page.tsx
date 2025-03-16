'use client'

import React, { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import useGame from '@/hooks/useGame'
import { GameConfig } from '@/types/game'

const doubleConfig: GameConfig = {
  type: 'double',
  wordLength: 5,
  maxAttempts: 7
}

const TUTORIAL_SHOWN_KEY = 'double-tutorial-shown'

export default function DoubleWordle() {
  const firstGame = useGame(doubleConfig)
  const secondGame = useGame(doubleConfig)
  const [showTutorial, setShowTutorial] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SHOWN_KEY)
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
  }, [])

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (gameCompleted) return
      
      if (e.key === 'Enter') {
        handleEnterKey()
      } else if (e.key === 'Backspace') {
        firstGame.onKeyPress('BACKSPACE')
        secondGame.onKeyPress('BACKSPACE')
      } else if (/^[A-Za-z]$/.test(e.key)) {
        firstGame.onKeyPress(e.key.toUpperCase())
        secondGame.onKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [firstGame, secondGame, gameCompleted])

  // Handle Enter key press - apply guess to both games
  const handleEnterKey = () => {
    // Only proceed if the guess is of correct length
    if (firstGame.gameState.currentGuess.length !== doubleConfig.wordLength) {
      setErrorMessage(`Word must be ${doubleConfig.wordLength} letters long`)
      setTimeout(() => setErrorMessage(null), 2000)
      return
    }

    // Try applying the guess to both games simultaneously
    firstGame.onKeyPress('ENTER')
    secondGame.onKeyPress('ENTER')

    // Check if game is completed
    if (firstGame.gameState.gameStatus !== 'playing' || secondGame.gameState.gameStatus !== 'playing') {
      setGameCompleted(true)
    }
  }

  const isGameOver = firstGame.gameState.gameStatus !== 'playing' || 
                    secondGame.gameState.gameStatus !== 'playing' ||
                    firstGame.gameState.turn >= doubleConfig.maxAttempts

  const hasWon = firstGame.gameState.gameStatus === 'won' && 
                 secondGame.gameState.gameStatus === 'won'

  // Format usedKeys for the keyboard component
  const formatKeyboardStatuses = () => {
    const statuses: Record<string, 'correct' | 'present' | 'absent' | 'unused'> = {};
    
    // Add the alphabet
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      const firstStatus = firstGame.usedKeys[letter] || 'unused';
      const secondStatus = secondGame.usedKeys[letter] || 'unused';
      
      // Prioritize 'correct' status, then 'present', then 'absent'
      if (firstStatus === 'correct' || secondStatus === 'correct') {
        statuses[letter] = 'correct';
      } else if (firstStatus === 'present' || secondStatus === 'present') {
        statuses[letter] = 'present';
      } else if (firstStatus === 'absent' || secondStatus === 'absent') {
        statuses[letter] = 'absent';
      } else {
        statuses[letter] = 'unused';
      }
    });
    
    return statuses;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
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
          <h1 className="text-3xl font-bold">Double Wordle</h1>
        </div>
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
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Solve both words with the same guesses!</h2>
        <p className="text-gray-700">Each guess applies to both puzzles simultaneously.</p>
        <p className="text-sm text-gray-600 mt-1">Tries remaining: {doubleConfig.maxAttempts - firstGame.gameState.turn}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">Word 1</h2>
          <Grid
            guesses={firstGame.gameState.guesses}
            currentGuess={firstGame.gameState.currentGuess}
            solution={firstGame.gameState.solution}
            maxAttempts={firstGame.gameState.maxTurns}
            wordLength={doubleConfig.wordLength}
          />
        </div>

        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">Word 2</h2>
          <Grid
            guesses={secondGame.gameState.guesses}
            currentGuess={secondGame.gameState.currentGuess}
            solution={secondGame.gameState.solution}
            maxAttempts={secondGame.gameState.maxTurns}
            wordLength={doubleConfig.wordLength}
          />
        </div>
      </div>

      <div className="mt-8">
        <Keyboard
          onKey={(key) => {
            if (!gameCompleted) {
              firstGame.onKeyPress(key);
              secondGame.onKeyPress(key);
            }
          }}
          onEnter={handleEnterKey}
          onDelete={() => {
            if (!gameCompleted) {
              firstGame.onKeyPress('BACKSPACE');
              secondGame.onKeyPress('BACKSPACE');
            }
          }}
          letterStatuses={formatKeyboardStatuses()}
        />
      </div>

      {isGameOver && (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {hasWon ? 'Congratulations!' : 'Game Over!'}
          </h2>
          <p className="text-lg">
            {hasWon
              ? `You solved both words in ${firstGame.gameState.turn} turns!`
              : `You solved ${firstGame.gameState.gameStatus === 'won' ? 1 : 0} out of 2 words.`}
          </p>
          <p className="mt-2">
            The words were: <span className="font-bold">{firstGame.gameState.solution}</span> and <span className="font-bold">{secondGame.gameState.solution}</span>
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
        gameType="double"
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <Toast
        message={errorMessage || ''}
        isVisible={!!errorMessage}
        onHide={() => setErrorMessage(null)}
        type="error"
      />
    </div>
  )
} 