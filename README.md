# Crosswordle - A Daily Word Puzzle Game

A daily puzzle game inspired by Wordle where players try to guess two crossing words simultaneously.

## How to Play

- Fill in the horizontal word first, then the vertical word
- Each guess is evaluated against both words
- Green tiles indicate correct letters in the correct position
- Yellow tiles indicate correct letters in the wrong position  
- Orange tiles indicate letters that appear in the other crossing word
- Gray tiles indicate letters that don't appear in either word
- The words are related thematically
- New puzzle every day!

## How to Host on GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select the `main` branch as the source
   - Choose the root folder (`/`)
   - Click Save

Your game will be available at `https://[your-username].github.io/[repository-name]/`

## Adding New Puzzles

Puzzles are stored in `src/data/crosswordlePuzzles.json`. To add new puzzles:

1. Open the file `src/data/crosswordlePuzzles.json`
2. Add new entries to the `puzzles` array following this format:

```json
{
  "id": 1015,  // Increment the ID for each new puzzle
  "horizontal": "HEART",  // 5-letter horizontal word
  "vertical": "HAPPY",    // 5-letter vertical word 
  "relation": "Both relate to emotions"  // Describe the relationship between words
}
```

3. Ensure both words share at least one letter so they can cross
4. The game selects puzzles based on the current date:
   - The puzzle number is calculated as 1000 + days since Jan 1, 2023
   - Puzzles are then matched by ID
   - If no exact match is found, it cycles through available puzzles

## Rules for Good Puzzles

1. Both words must be 5 letters long
2. Words should share at least one common letter (for the crossing)
3. Use common, recognizable words
4. Choose words with a clear thematic relationship
5. Avoid obscure words, slang, or offensive content

## Development

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## License

MIT
