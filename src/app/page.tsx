import Link from 'next/link'

interface GameCard {
  title: string
  description: string
  href: string
  color: string
}

const games: GameCard[] = [
  {
    title: 'Classic Wordle',
    description: 'Guess the 5-letter word in 6 tries',
    href: '/games/classic',
    color: 'bg-green-100 hover:bg-green-200',
  },
  {
    title: 'Speed Wordle',
    description: 'Race against time to solve the word',
    href: '/games/speed',
    color: 'bg-yellow-100 hover:bg-yellow-200',
  },
  {
    title: 'Double Wordle',
    description: 'Solve two connected words at once',
    href: '/games/double',
    color: 'bg-purple-100 hover:bg-purple-200',
  },
  {
    title: 'Hard Wordle',
    description: 'Challenge yourself with 6-letter words',
    href: '/games/hard',
    color: 'bg-red-100 hover:bg-red-200',
  },
  {
    title: 'Chain Wordle',
    description: 'Each word must start with the last letter of the previous word',
    href: '/games/chain',
    color: 'bg-amber-100 hover:bg-amber-200',
  },
  {
    title: 'Backwards Wordle',
    description: 'Spell words in reverse order',
    href: '/games/backwards',
    color: 'bg-emerald-100 hover:bg-emerald-200',
  },
  {
    title: 'Crosswordle',
    description: 'Solve a crossword with themed words',
    href: '/games/crosswordle',
    color: 'bg-teal-100 hover:bg-teal-200',
  },
  {
    title: 'Waffle Wordle',
    description: 'Swap letters to solve the waffle grid',
    href: '/games/waffle',
    color: 'bg-pink-100 hover:bg-pink-200',
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Wordle Games</h1>
        <p className="text-xl text-gray-600">Choose your challenge and start playing!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
        {games.map((game) => (
          <Link 
            key={game.title} 
            href={game.href}
            className={`${game.color} rounded-lg p-6 shadow-sm transition-transform hover:scale-105`}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
