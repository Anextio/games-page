import { useState, useEffect } from 'react'
import { format, differenceInDays, subDays, parseISO } from 'date-fns'

export interface PuzzleHistoryEntry {
  date: string
  number: number
  completed: boolean
}

interface SavedPuzzle {
  number: number
  date: string
}

const DAYS_TO_KEEP = 7 // Number of previous days' puzzles to make available

export const usePuzzleHistory = (gameType: string, totalPuzzles: number) => {
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([])
  const [availablePuzzles, setAvailablePuzzles] = useState<PuzzleHistoryEntry[]>([])
  const [currentPuzzle, setCurrentPuzzle] = useState<{number: number; date: string}>({
    number: 1,
    date: format(new Date(), 'yyyy-MM-dd')
  })
  
  const COMPLETED_KEY = `${gameType}-completed-puzzles`
  const CURRENT_KEY = `${gameType}-current-puzzle`
  
  // Initialize puzzle history
  useEffect(() => {
    // Load completed puzzles from local storage
    const savedCompleted = localStorage.getItem(COMPLETED_KEY)
    const completedList = savedCompleted ? JSON.parse(savedCompleted) : []
    setCompletedPuzzles(completedList)
    
    // Check if there's a saved current puzzle
    const savedCurrent = localStorage.getItem(CURRENT_KEY)
    
    // Calculate today's puzzle number
    const today = new Date()
    const startDate = new Date(2023, 0, 1) // Jan 1, 2023
    const daysDiff = differenceInDays(today, startDate)
    const todaysPuzzleNumber = (daysDiff % totalPuzzles) + 1
    
    // Generate available puzzles (last N days)
    const puzzleHistory: PuzzleHistoryEntry[] = []
    for (let i = 0; i < DAYS_TO_KEEP; i++) {
      const date = subDays(today, i)
      const puzzleDate = format(date, 'yyyy-MM-dd')
      const daysSinceStart = differenceInDays(date, startDate)
      const puzzleNumber = (daysSinceStart % totalPuzzles) + 1
      
      puzzleHistory.push({
        date: puzzleDate,
        number: puzzleNumber,
        completed: completedList.includes(puzzleNumber)
      })
    }
    setAvailablePuzzles(puzzleHistory)
    
    // Use saved puzzle or today's puzzle
    let targetPuzzleNumber = todaysPuzzleNumber
    let targetDate = format(today, 'yyyy-MM-dd')
    
    if (savedCurrent) {
      const savedPuzzle: SavedPuzzle = JSON.parse(savedCurrent)
      // Only use saved puzzle if it's within the last N days
      const savedDate = parseISO(savedPuzzle.date)
      if (differenceInDays(today, savedDate) < DAYS_TO_KEEP) {
        targetPuzzleNumber = savedPuzzle.number
        targetDate = savedPuzzle.date
      }
    }
    
    setCurrentPuzzle({
      number: targetPuzzleNumber,
      date: targetDate
    })
  }, [gameType, totalPuzzles])
  
  // Mark a puzzle as completed
  const markCompleted = (puzzleNumber: number) => {
    if (!completedPuzzles.includes(puzzleNumber)) {
      const updatedCompleted = [...completedPuzzles, puzzleNumber]
      setCompletedPuzzles(updatedCompleted)
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(updatedCompleted))
      
      // Update available puzzles list
      setAvailablePuzzles(prev => 
        prev.map(puzzle => 
          puzzle.number === puzzleNumber 
            ? { ...puzzle, completed: true } 
            : puzzle
        )
      )
    }
  }
  
  // Load a specific puzzle
  const loadPuzzle = (puzzleNumber: number, date: string) => {
    setCurrentPuzzle({ number: puzzleNumber, date })
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ number: puzzleNumber, date }))
  }
  
  // Format the current date for display
  const formattedDate = currentPuzzle.date 
    ? format(parseISO(currentPuzzle.date), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy')
  
  return {
    currentPuzzle,
    formattedDate,
    availablePuzzles,
    completedPuzzles,
    markCompleted,
    loadPuzzle
  }
}

export default usePuzzleHistory 