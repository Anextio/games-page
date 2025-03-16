#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const puzzleFilePath = path.join(__dirname, '..', 'src', 'data', 'crosswordlePuzzles.json');

// Read existing puzzles
let puzzleData;
try {
  puzzleData = JSON.parse(fs.readFileSync(puzzleFilePath, 'utf8'));
} catch (err) {
  console.error('Error reading puzzle file:', err.message);
  process.exit(1);
}

console.log('=== Validating Crosswordle Puzzles ===');
console.log(`Found ${puzzleData.puzzles.length} puzzles to validate`);
console.log('-'.repeat(40));

let hasErrors = false;

// Validate each puzzle
puzzleData.puzzles.forEach((puzzle) => {
  const { id, horizontal, vertical, relation } = puzzle;
  console.log(`Puzzle #${id}: ${horizontal} + ${vertical} (${relation})`);
  
  // Check if both words are 5 letters
  if (horizontal.length !== 5 || vertical.length !== 5) {
    console.error(`ERROR: Puzzle #${id} has words of incorrect length`);
    hasErrors = true;
  }
  
  // Find common letters and their positions
  let foundCommon = false;
  let commonPositions = [];
  
  for (let h = 0; h < horizontal.length; h++) {
    for (let v = 0; v < vertical.length; v++) {
      if (horizontal[h] === vertical[v]) {
        foundCommon = true;
        commonPositions.push({
          letter: horizontal[h],
          horizontalPos: h,
          verticalPos: v
        });
      }
    }
  }
  
  if (!foundCommon) {
    console.error(`ERROR: Puzzle #${id} has no common letters between words`);
    hasErrors = true;
  } else {
    console.log(`  ✓ Found ${commonPositions.length} common letters:`);
    commonPositions.forEach(pos => {
      console.log(`    - "${pos.letter}" at positions: horizontal ${pos.horizontalPos+1}, vertical ${pos.verticalPos+1}`);
    });
  }
  
  console.log('-'.repeat(40));
});

if (hasErrors) {
  console.error('Validation completed with errors. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('All puzzles validate successfully! ✓');
} 