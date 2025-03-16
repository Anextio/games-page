"use client"

import React from 'react'
import { format, parseISO } from 'date-fns'
import { PuzzleHistoryEntry } from '@/hooks/usePuzzleHistory'

interface PuzzleSelectorProps {
  isOpen: boolean
  onClose: () => void
  puzzles: PuzzleHistoryEntry[]
  currentPuzzleNumber: number
  onSelectPuzzle: (number: number, date: string) => void
  gameType: string
}

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({
  isOpen,
  onClose,
  puzzles,
  currentPuzzleNumber,
  onSelectPuzzle,
  gameType
}) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select {gameType} Puzzle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Play previous puzzles from the last 7 days:</p>
          <div className="space-y-2">
            {puzzles.map((puzzle, index) => (
              <button
                key={index}
                onClick={() => onSelectPuzzle(puzzle.number, puzzle.date)}
                className={`w-full p-3 rounded flex justify-between items-center ${
                  puzzle.completed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                } ${puzzle.number === currentPuzzleNumber ? 'ring-2 ring-blue-500' : ''}`}
                disabled={puzzle.number === currentPuzzleNumber}
              >
                <span>
                  {format(parseISO(puzzle.date), 'MMM d, yyyy')}
                  {index === 0 && ' (Today)'}
                </span>
                <span className="flex items-center">
                  {puzzle.completed && (
                    <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  Puzzle #{puzzle.number}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default PuzzleSelector 