"use client"

import React, { useEffect } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import VictoryAnimation from '@/components/VictoryAnimation'
import useGame from '@/hooks/useGame'
import { GameConfig } from '@/types/game'

const chainConfig: GameConfig = {
  type: 'chain',
  wordLength: 5,
  maxAttempts: 6
}

const TUTORIAL_SHOWN_KEY = 'chain-tutorial-shown'

export default function ChainWordle() {
  const { gameState, usedKeys, onKeyPress, errorMessage } = useGame(chainConfig)
  const [showTutorial, setShowTutorial] = React.useState(false)

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

  const getLastGuessLastLetter = (): string | null => {
    if (gameState.guesses.length === 0) return null
    
    const lastGuess = gameState.guesses[gameState.guesses.length - 1]
    return lastGuess ? lastGuess[lastGuess.length - 1].toUpperCase() : null
  }

  const lastLetter = getLastGuessLastLetter()

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
          <h1 className="text-3xl font-bold">Chain Wordle</h1>
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
      
      {lastLetter && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Your next word must start with:</h2>
          <p className="text-4xl font-bold text-blue-600">{lastLetter}</p>
        </div>
      )}
      
      <div className="flex flex-col items-center w-full">
        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          solution={gameState.solution}
          maxAttempts={gameState.maxTurns}
          wordLength={chainConfig.wordLength}
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
        gameType="chain"
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
    </div>
  )
} 