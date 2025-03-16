"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGuessStatuses } from '@/utils/words'

interface GridProps {
  guesses: string[]
  currentGuess: string
  solution: string
  maxAttempts: number
  wordLength: number
}

interface CellProps {
  value: string
  status: 'correct' | 'present' | 'absent' | 'empty' | 'tbd'
  index: number
  isRevealing: boolean
}

const Cell: React.FC<CellProps> = ({ value, status, index, isRevealing }) => {
  const [hasRevealed, setHasRevealed] = React.useState(false)
  
  React.useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        setHasRevealed(true)
      }, index * 300) // Delay each letter's flip
      return () => clearTimeout(timer)
    }
  }, [isRevealing, index])

  const baseClass = 'w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded'
  
  const stateClass = {
    correct: 'border-green-500 bg-green-500 text-white',
    present: 'border-yellow-500 bg-yellow-500 text-white',
    absent: 'border-gray-500 bg-gray-500 text-white',
    empty: 'border-gray-300',
    tbd: 'border-gray-300 text-black'
  }[status]

  // Show revealed state if the cell has been revealed or if it's not part of the current guess
  const shouldShowRevealedState = hasRevealed || (status !== 'tbd' && status !== 'empty' && !isRevealing)

  // Animation variants for the flip effect
  const variants = {
    initial: { 
      rotateX: 0,
      scale: 1
    },
    flipping: {
      rotateX: 90,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    flipped: {
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="perspective-500">
      <motion.div
        className={`${baseClass} ${shouldShowRevealedState ? stateClass : 'border-gray-300 bg-white text-black'}`}
        initial="initial"
        animate={
          isRevealing
            ? hasRevealed
              ? "flipped"
              : "flipping"
            : status === 'empty'
            ? "shake"
            : "initial"
        }
        variants={variants}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden"
        }}
      >
        {value.toUpperCase()}
      </motion.div>
    </div>
  )
}

const Grid: React.FC<GridProps> = ({
  guesses,
  currentGuess,
  solution,
  maxAttempts,
  wordLength
}) => {
  const [isRevealing, setIsRevealing] = React.useState(false)

  React.useEffect(() => {
    if (guesses.length > 0 && guesses[guesses.length - 1]) {
      setIsRevealing(true)
      const timer = setTimeout(() => setIsRevealing(false), (wordLength * 300) + 600)
      return () => clearTimeout(timer)
    }
  }, [guesses, wordLength])

  const getCellStatus = (guess: string, position: number): CellProps['status'] => {
    const letter = guess[position]
    if (!letter) return 'empty'
    if (guess === currentGuess) return 'tbd'
    
    // Use the getGuessStatuses function to properly handle duplicate letters
    const statuses = getGuessStatuses(guess, solution)
    return statuses[position]
  }

  const rows = Array(maxAttempts).fill(null)

  return (
    <motion.div 
      className="grid gap-2 mx-auto mb-4 flex justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {rows.map((_, rowIndex) => {
        const guess = guesses[rowIndex] || ''
        const isCurrentGuess = rowIndex === guesses.length
        const displayGuess = isCurrentGuess ? currentGuess : guess

        return (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {Array(wordLength).fill(null).map((_, colIndex) => (
              <Cell
                key={colIndex}
                value={displayGuess[colIndex] || ''}
                status={getCellStatus(displayGuess, colIndex)}
                index={colIndex}
                isRevealing={isRevealing && rowIndex === guesses.length - 1}
              />
            ))}
          </div>
        )
      })}
    </motion.div>
  )
}

export default Grid 