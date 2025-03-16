# Word Games Collection

A collection of word-based puzzle games inspired by Wordle, built with Next.js, React, and TypeScript.

## 🎮 Available Games

This repository includes the following word games:

1. **Classic Wordle** - The original Wordle experience with daily puzzles
2. **Hard Mode** - 6-letter words with fewer attempts
3. **Backwards Wordle** - Enter words in reverse
4. **Chain Wordle** - Each guess must start with the last letter of the previous word
5. **Double Wordle** - Solve two puzzles simultaneously using the same guesses
6. **Speed Wordle** - Race against the clock to solve shorter 4-letter words
7. **Crosswordle** - Solve intersecting horizontal and vertical words
8. **Waffle Wordle** - Rearrange letters to form valid words in both directions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Anextio/games-page.git
cd games-page

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:3000

## 📝 Adding New Puzzles

This project includes scripts to help manage puzzles for games that use daily challenges.

### Adding a New Puzzle

Use the `add-puzzle` script to add a new puzzle:

```bash
npm run add-puzzle -- --type <game-type> --word <word> --date <date> [--hint <hint>]
```

Parameters:
- `type`: The game type (classic, hard, crosswordle, etc.)
- `word`: The solution word
- `date`: The date for the puzzle (YYYY-MM-DD format)
- `hint`: Optional hint (for games that use hints)

Example:
```bash
npm run add-puzzle -- --type classic --word TRAIN --date 2023-06-01
```

For Crosswordle puzzles (which require horizontal and vertical words):
```bash
npm run add-puzzle -- --type crosswordle --word "TRAIN,APPLE" --date 2023-06-01 --hint "Transportation and fruit"
```

### Validating Puzzles

To ensure all puzzles are valid, run:

```bash
npm run validate-puzzles
```

This script checks:
- All words are valid
- No duplicate dates for the same game type
- Correct word length for each game type
- Proper formatting

## 📂 Project Structure

```
games-page/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── games/           # Game pages
│   │   │   ├── classic/
│   │   │   ├── hard/
│   │   │   ├── backwards/
│   │   │   └── ...
│   ├── components/          # Shared React components
│   ├── data/                # Game data including word lists
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── scripts/                 # Helper scripts for puzzle management
│   ├── addPuzzle.js         # Script for adding new puzzles
│   └── validatePuzzles.js   # Script for validating puzzles
└── ...
```

## 🔄 Game Configuration

Each game has its own configuration that determines its behavior:

```typescript
// Example game configuration
const gameConfig = {
  type: 'classic',           // Game type identifier
  wordLength: 5,             // Length of solution words
  maxAttempts: 6,            // Number of allowed guesses
  timeLimit: null            // Time limit (for timed games)
}
```

## 🌐 Deployment

This project is deployed to GitHub Pages using GitHub Actions. When you push to the main branch, the app is automatically built and deployed to https://anextio.github.io/games-page/

### Manual Deployment

If you want to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out` directory.

## 🤝 Contributing

Contributions are welcome! Feel free to add new games, improve existing ones, or enhance the user interface.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
