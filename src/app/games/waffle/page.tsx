"use client"

import React, { useState, useEffect } from 'react'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import { generateWaffleGrid } from '@/utils/words'

const TUTORIAL_SHOWN_KEY = 'waffle-tutorial-shown'
const MAX_SWAPS = 15

export default function WaffleWordle() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [grid, setGrid] = useState<string[][]>([])
  const [solution, setSolution] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [fixedCells, setFixedCells] = useState<Set<string>>(new Set())
  const [swapsRemaining, setSwapsRemaining] = useState(MAX_SWAPS)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  
  // Size of the waffle grid
  const size = 5
  
  // Initialize the game
  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SHOWN_KEY)
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true')
    }
    
    // Generate a waffle grid
    const { horizontalWords, verticalWords } = generateWaffleGrid(3)
    
    // Create the solution grid
    const solutionGrid = Array(size).fill(null).map(() => Array(size).fill(''))
    
    // Place horizontal words
    for (let i = 0; i < 3; i++) {
      const word = horizontalWords[i]
      const row = i * 2 // Place at rows 0, 2, 4
      
      for (let j = 0; j < word.length; j++) {
        solutionGrid[row][j] = word[j].toUpperCase()
      }
    }
    
    // Place vertical words
    for (let i = 0; i < 3; i++) {
      const word = verticalWords[i]
      const col = i * 2 // Place at columns 0, 2, 4
      
      for (let j = 0; j < word.length; j++) {
        solutionGrid[j][col] = word[j].toUpperCase()
      }
    }
    
    setSolution(solutionGrid)
    
    // Create a shuffled grid for the player
    // We'll keep intersections fixed and shuffle the rest
    const playerGrid = JSON.parse(JSON.stringify(solutionGrid))
    const movableCells: { row: number, col: number, letter: string }[] = []
    const fixed = new Set<string>()
    
    // Identify intersections and movable cells
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (solutionGrid[row][col]) {
          // Check if it's an intersection (both row and column are even)
          if (row % 2 === 0 && col % 2 === 0) {
            fixed.add(`${row},${col}`)
          } else {
            movableCells.push({
              row, col, letter: solutionGrid[row][col]
            })
          }
        }
      }
    }
    
    // Shuffle the movable cells
    for (let i = movableCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      
      // Swap cells i and j
      const temp = movableCells[i]
      movableCells[i] = movableCells[j]
      movableCells[j] = temp
    }
    
    // Place shuffled cells back on the grid
    let cellIndex = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (solutionGrid[row][col] && !fixed.has(`${row},${col}`)) {
          playerGrid[row][col] = movableCells[cellIndex++].letter
        }
      }
    }
    
    setGrid(playerGrid)
    setFixedCells(fixed)
  }, [])
  
  // Show error message
  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 2000)
  }
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // Skip empty cells or fixed cells
    if (!grid[row]?.[col] || fixedCells.has(`${row},${col}`)) return
    
    if (selectedCell === null) {
      // First selection
      setSelectedCell({ row, col })
    } else if (selectedCell.row === row && selectedCell.col === col) {
      // Deselect
      setSelectedCell(null)
    } else {
      // Swap cells
      const newGrid = [...grid.map(row => [...row])]
      const temp = newGrid[selectedCell.row][selectedCell.col]
      newGrid[selectedCell.row][selectedCell.col] = newGrid[row][col]
      newGrid[row][col] = temp
      
      setGrid(newGrid)
      setSelectedCell(null)
      setSwapsRemaining(prev => prev - 1)
      
      // Check if the grid is solved
      checkSolution(newGrid)
    }
  }
  
  // Check if the current grid matches the solution
  const checkSolution = (currentGrid: string[][]) => {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (currentGrid[row]?.[col] && currentGrid[row][col] !== solution[row][col]) {
          return false
        }
      }
    }
    
    // If we get here, the grid is solved
    setGameCompleted(true)
    return true
  }
  
  // Get cell status (correct, selected, or regular)
  const getCellStatus = (row: number, col: number) => {
    if (!grid[row]?.[col]) return 'empty'
    
    if (fixedCells.has(`${row},${col}`)) return 'fixed'
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) return 'selected'
    
    if (grid[row][col] === solution[row][col]) return 'correct'
    
    return 'regular'
  }
  
  // Get cell CSS class based on status
  const getCellClass = (status: string) => {
    const baseClass = 'w-12 h-12 m-1 flex items-center justify-center text-xl font-bold rounded cursor-pointer transition-colors'
    
    switch (status) {
      case 'empty':
        return `${baseClass} bg-gray-200`
      case 'fixed':
        return `${baseClass} bg-green-500 text-white cursor-not-allowed`
      case 'selected':
        return `${baseClass} bg-blue-500 text-white`
      case 'correct':
        return `${baseClass} bg-green-100 border-2 border-green-500 text-green-800`
      default:
        return `${baseClass} bg-white border-2 border-gray-300 hover:bg-gray-100`
    }
  }
  
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold">Waffle Wordle</h1>
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
      
      <div className="mb-6 text-center">
        <p className="text-lg text-gray-700 mb-2">
          Swap letters to form valid words in both directions.
        </p>
        <p className="text-md text-gray-600">
          Swaps remaining: <span className="font-bold">{swapsRemaining}</span>
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-5 gap-0">
          {Array(size).fill(null).map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {Array(size).fill(null).map((_, colIndex) => {
                const cellStatus = getCellStatus(rowIndex, colIndex)
                const cellClass = getCellClass(cellStatus)
                
                // Don't render anything for empty cells
                if (!grid[rowIndex]?.[colIndex]) {
                  return <div key={colIndex} className="w-12 h-12 m-1" />
                }
                
                return (
                  <div
                    key={colIndex}
                    className={cellClass}
                    onClick={() => swapsRemaining > 0 && !gameCompleted && handleCellClick(rowIndex, colIndex)}
                  >
                    {grid[rowIndex][colIndex]}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {gameCompleted && (
        <div className="text-center p-6 bg-green-50 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Congratulations!</h2>
          <p className="text-green-700 mb-4">
            You solved the waffle with {MAX_SWAPS - swapsRemaining} swaps!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      
      {swapsRemaining === 0 && !gameCompleted && (
        <div className="text-center p-6 bg-red-50 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Game Over</h2>
          <p className="text-red-700 mb-4">
            You've used all your swaps but haven't solved the waffle.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      <Tutorial
        gameType="waffle"
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <Toast
        message={errorMessage || ''}
        isVisible={!!errorMessage}
        onHide={() => {}}
        type="error"
      />
    </div>
  )
} 