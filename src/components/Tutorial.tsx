"use client"

import React from 'react'
import { GameType } from '@/types/game'

interface TutorialProps {
  gameType: GameType
  isOpen: boolean
  onClose: () => void
}

interface TutorialContent {
  title: string
  description: string
  examples: {
    word: string
    guess: string
    explanation: string
  }[]
  additionalRules?: string[]
}

const TUTORIAL_CONTENT: Record<GameType, TutorialContent> = {
  classic: {
    title: 'How to Play Classic Wordle',
    description: 'Guess the 5-letter word in 6 tries. After each guess, the tiles will change color to show how close you are to the solution.',
    examples: [
      {
        word: 'REACT',
        guess: 'READS',
        explanation: 'R, E, and A are in the correct positions (green). The letters D and S are not in the target word (gray).'
      },
      {
        word: 'REACT',
        guess: 'TRACE',
        explanation: 'All these letters are in the word but in the wrong positions (yellow). Try rearranging them.'
      }
    ],
    additionalRules: [
      'Each guess must be a valid 5-letter English word',
      'Letters can be used more than once (e.g., "HELLO" has two Ls)',
      'Green tile = correct letter in the correct position',
      'Yellow tile = correct letter in the wrong position',
      'Gray tile = letter not in the word',
      'A new word is available each day'
    ]
  },
  speed: {
    title: 'How to Play Speed Wordle',
    description: 'Race against the clock to guess a 4-letter word. You have 60 seconds to solve the puzzle before time runs out!',
    examples: [
      {
        word: 'FAST',
        guess: 'FISH',
        explanation: 'F is in the correct position (green). The I is present in the word but in a different position (yellow). S and H are not in the word (gray).'
      },
      {
        word: 'FAST',
        guess: 'LAST',
        explanation: 'A, S, and T are all in the correct positions (green). L is not in the word (gray).'
      }
    ],
    additionalRules: [
      'Each guess must be a valid 4-letter English word',
      'The 60-second timer starts when you make your first guess',
      'The timer is shown at the top of the screen',
      'If time runs out, the game ends and you lose',
      'Faster solutions earn more points - try to beat your best time!'
    ]
  },
  double: {
    title: 'How to Play Double Wordle',
    description: 'Solve two related 5-letter words at the same time. Both words have a thematic connection!',
    examples: [
      {
        word: 'BREAD',
        guess: 'BREAK',
        explanation: 'B, R, E, and A are all correct (green). The K is not in the word (gray).'
      },
      {
        word: 'BUTTER',
        guess: 'BATTLE',
        explanation: 'B, T, and T are in the correct positions (green). The E is in the word but in a different position (yellow). A and L are not in the word (gray).'
      }
    ],
    additionalRules: [
      'Solve two related 5-letter words with 7 attempts',
      'Use the tab button or click the word indicator to switch between puzzles',
      'Both words must be solved to win the game',
      'The two words are always related (e.g., "BREAD" and "BUTTER")',
      'Your progress on both words is tracked separately'
    ]
  },
  hard: {
    title: 'How to Play Hard Wordle',
    description: 'Challenge yourself with 6-letter words! This more difficult version requires stronger vocabulary and strategic guessing.',
    examples: [
      {
        word: 'SYSTEM',
        guess: 'STRING',
        explanation: 'S and T are in the correct positions (green). The E and M are in the word but in different positions (yellow).'
      },
      {
        word: 'SYSTEM',
        guess: 'STYLED',
        explanation: 'S, T, and E are in the correct positions (green). Y is in the word but in a different position (yellow).'
      }
    ],
    additionalRules: [
      'Each guess must be a valid 6-letter English word',
      'You have 6 attempts to solve the puzzle',
      'The longer word length makes this more challenging',
      'Words are often related to technology, programming, or science',
      'Green = correct letter, correct position',
      'Yellow = correct letter, wrong position',
      'Gray = letter not in the word'
    ]
  },
  chain: {
    title: 'How to Play Chain Wordle',
    description: 'Create a chain of connected words where each new word must start with the last letter of your previous guess.',
    examples: [
      {
        word: 'CHAIN',
        guess: 'CLEAR',
        explanation: 'C is correct (green). H and A are present in the word but in different positions (yellow).'
      },
      {
        word: 'ROUND',
        guess: 'REACH',
        explanation: 'R is correct (green). After entering "REACH", your next word must start with "H" (the last letter).'
      }
    ],
    additionalRules: [
      'Your first guess can start with any letter',
      'Each subsequent guess must start with the last letter of your previous guess',
      'The game will highlight the required starting letter for your next guess',
      'All guesses must be valid 5-letter English words',
      'You have 6 tries to guess the target word',
      'If you break the chain rule, your guess will be rejected'
    ]
  },
  backwards: {
    title: 'How to Play Backwards Wordle',
    description: 'Enter any valid 5-letter word spelled backwards! Type the word in reverse order and get feedback on your guess.',
    examples: [
      {
        word: 'SMART',
        guess: 'TRAMS',
        explanation: 'To enter "SMART", you type "TRAMS" - the word spelled backwards. The color feedback will be based on matching letters.'
      },
      {
        word: 'LEVEL',
        guess: 'LEVEL',
        explanation: 'Some words are the same spelled forwards or backwards (palindromes). "LEVEL" is entered the same way.'
      }
    ],
    additionalRules: [
      'Enter any valid 5-letter English word spelled backwards',
      'For example, to guess "HELLO", you would type "OLLEH"',
      'The word is correct if it\'s a valid English word when reversed',
      'You have 6 tries to find a valid word',
      'Green = correct letter, correct position',
      'Yellow = correct letter, wrong position',
      'Gray = letter not in the word',
      'You win as soon as you enter a valid word backwards'
    ]
  },
  crosswordle: {
    title: 'How to Play Crosswordle',
    description: 'Solve two related 5-letter words that cross at a common letter. You get feedback for both words after each guess.',
    examples: [
      {
        word: 'BEACH',
        guess: 'BREAD',
        explanation: 'B, A are correct (green). The E is in the word but in wrong position (yellow). R and D are not in the word "BEACH" (gray).'
      },
      {
        word: 'OCEAN',
        guess: 'COAST',
        explanation: 'C and A are correct (green). O is in the word but in a different position (yellow). S and T aren\'t in this word but S appears in the crossing word (orange).'
      }
    ],
    additionalRules: [
      'Each guess must include both a horizontal and vertical 5-letter word',
      'The two words share at least one common letter where they cross',
      'Green tiles = correct letter in correct position',
      'Yellow tiles = correct letter in wrong position',
      'Orange tiles = letter appears in the other crossing word',
      'Gray tiles = letter not in either word',
      'The two words always have a thematic relationship (shown as a hint)',
      'A new puzzle is available each day'
    ]
  },
  waffle: {
    title: 'How to Play Waffle Wordle',
    description: 'Rearrange letters in a waffle-shaped grid to form valid words both horizontally and vertically. The initial layout contains all the correct letters, but in the wrong order.',
    examples: [
      {
        word: 'APPLE',
        guess: 'APLPE',
        explanation: 'By swapping P and L, you can turn "APLPE" into the correct word "APPLE".'
      },
      {
        word: 'READS',
        guess: 'RESDA',
        explanation: 'Several swaps are needed: move "S" after "D" and move "A" to the end to form "READS".'
      }
    ],
    additionalRules: [
      'All the correct letters are already on the grid, just in the wrong positions',
      'Fixed letters (in green) cannot be moved',
      'You can only swap letters that are not fixed',
      'You have a limited number of swaps to solve the entire puzzle',
      'You need to form valid 5-letter words in both horizontal and vertical directions',
      'The goal is to solve the grid using as few swaps as possible',
      'The number of remaining swaps is displayed on screen'
    ]
  }
}

const ExampleRow: React.FC<{ guess: string; word: string }> = ({ guess, word }) => {
  const cells = guess.split('').map((letter, i) => {
    let status = 'absent'
    if (letter === word[i]) {
      status = 'correct'
    } else if (word.includes(letter)) {
      status = 'present'
    }

    const baseClass = 'w-12 h-12 border-2 flex items-center justify-center text-xl font-bold rounded mx-0.5 transform transition-all duration-150'
    const stateClass = {
      correct: 'border-green-600 bg-green-600 text-white shadow-md',
      present: 'border-yellow-500 bg-yellow-500 text-white shadow-md',
      absent: 'border-gray-600 bg-gray-600 text-white shadow-sm'
    }[status]

    return (
      <div key={i} className={`${baseClass} ${stateClass}`}>
        {letter}
      </div>
    )
  })

  return <div className="flex justify-center my-4">{cells}</div>
}

const Tutorial: React.FC<TutorialProps> = ({ gameType, isOpen, onClose }) => {
  if (!isOpen) return null

  const content = TUTORIAL_CONTENT[gameType]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{content.description}</p>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Examples:</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              {content.examples.map((example, i) => (
                <div key={i} className="mb-5 last:mb-1">
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {gameType === 'backwards' ? 
                      `Target word: ${example.word}` : 
                      (gameType === 'crosswordle' && i > 0) ?
                        `Crossing word: ${example.word}` :
                        `Word to guess: ${example.word}`
                    }
                  </div>
                  <ExampleRow guess={example.guess} word={example.word} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 px-1">
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {content.additionalRules && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Rules:</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  {content.additionalRules.map((rule, i) => (
                    <li key={i} className="pl-1">{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tutorial 