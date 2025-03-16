"use client"

import React from 'react'

interface KeyboardProps {
  onKey: (letter: string) => void
  onEnter: () => void
  onDelete: () => void
  letterStatuses: Record<string, 'correct' | 'present' | 'absent' | 'unused'>
}

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]

const Keyboard: React.FC<KeyboardProps> = ({
  onKey,
  onEnter,
  onDelete,
  letterStatuses
}) => {
  const onClick = (letter: string) => {
    onKey(letter)
  }

  const getKeyStatus = (key: string) => {
    return letterStatuses[key] || 'unused'
  }

  const getKeyClass = (status: string) => {
    const baseClass = 'flex items-center justify-center font-bold rounded py-3 text-base uppercase transition-colors'
    
    if (status === 'correct') return `${baseClass} bg-green-600 text-white hover:bg-green-700 shadow-md`
    if (status === 'present') return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600 shadow-md`
    if (status === 'absent') return `${baseClass} bg-gray-600 text-white hover:bg-gray-700 shadow-md`
    
    return `${baseClass} bg-gray-200 text-gray-800 hover:bg-gray-300`
  }

  return (
    <div className="w-full max-w-md mx-auto p-2 flex flex-col items-center">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 my-1.5 w-full">
          {i === 2 && (
            <button
              className={`${getKeyClass('unused')} px-4`}
              onClick={() => onEnter()}
            >
              Enter
            </button>
          )}
          {row.map((key) => (
            <button
              key={key}
              className={`${getKeyClass(getKeyStatus(key))} px-3 min-w-[2.5rem] w-full sm:w-auto`}
              onClick={() => onClick(key)}
            >
              {key}
            </button>
          ))}
          {i === 2 && (
            <button
              className={`${getKeyClass('unused')} px-4`}
              onClick={() => onDelete()}
            >
              ←
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Keyboard 