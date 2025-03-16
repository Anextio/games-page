'use client'

import React, { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import VictoryAnimation from '@/components/VictoryAnimation'
import useGame from '@/hooks/useGame'
import { GameConfig } from '@/types/game'

const speedConfig: GameConfig = {
  type: 'speed',
  wordLength: 4,
  maxAttempts: 6,
  timeLimit: 60 // 60 seconds
}

const TUTORIAL_SHOWN_KEY = 'speed-tutorial-shown'

export default function SpeedWordle() {
  const { gameState, usedKeys, onKeyPress, errorMessage } = useGame(speedConfig)
  const [showTutorial, setShowTutorial] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SHOWN_KEY)
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
  }, [])

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          // Time's up - game over
          gameState.gameStatus = 'lost'
          return 0
        }
        return currentTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.gameStatus])

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return
      
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
  }, [onKeyPress, gameState.gameStatus])

  useEffect(() => {
    if (gameState.turn > 0 && !isTimerRunning && gameState.gameStatus === 'playing') {
      setIsTimerRunning(true)
    }

    if (gameState.gameStatus !== 'playing') {
      setIsTimerRunning(false)
    }
  }, [gameState.turn, gameState.gameStatus, isTimerRunning])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isTimerRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState.gameStatus === 'playing') {
      // Game over due to time running out
      // This would be better handled within the useGame hook
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isTimerRunning, timeLeft, gameState.gameStatus])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
          <h1 className="text-3xl font-bold">Speed Wordle</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-mono ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
            {formatTime(timeLeft)}
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
      </div>
      
      <div className="flex flex-col items-center w-full">
        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          solution={gameState.solution}
          maxAttempts={gameState.maxTurns}
          wordLength={speedConfig.wordLength}
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
            {gameState.gameStatus === 'won' 
              ? 'Congratulations!' 
              : timeLeft === 0 
                ? 'Time\'s Up!' 
                : 'Game Over!'}
          </h2>
          <p className="text-lg">
            {gameState.gameStatus === 'won'
              ? `You won in ${gameState.turn} turns with ${timeLeft} seconds left!`
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
        gameType="speed"
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