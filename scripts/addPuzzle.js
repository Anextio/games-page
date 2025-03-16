#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const puzzleFilePath = path.join(__dirname, '..', 'src', 'data', 'crosswordlePuzzles.json');

// Read existing puzzles
let puzzleData;
try {
  puzzleData = JSON.parse(fs.readFileSync(puzzleFilePath, 'utf8'));
} catch (err) {
  console.error('Error reading puzzle file:', err.message);
  process.exit(1);
}

// Find the highest existing ID
const highestId = puzzleData.puzzles.reduce((max, puzzle) => {
  return puzzle.id > max ? puzzle.id : max;
}, 0);

// New puzzle ID will be highest + 1
const newId = highestId + 1;

console.log('=== Add New Crosswordle Puzzle ===');
console.log(`New puzzle ID will be: ${newId}`);

// Collect puzzle information
rl.question('Enter horizontal word (5 letters): ', (horizontal) => {
  horizontal = horizontal.trim().toUpperCase();
  
  if (horizontal.length !== 5) {
    console.error('Error: Horizontal word must be exactly 5 letters.');
    rl.close();
    process.exit(1);
  }
  
  rl.question('Enter vertical word (5 letters): ', (vertical) => {
    vertical = vertical.trim().toUpperCase();
    
    if (vertical.length !== 5) {
      console.error('Error: Vertical word must be exactly 5 letters.');
      rl.close();
      process.exit(1);
    }
    
    // Check if words share at least one letter
    let commonLetterFound = false;
    for (let i = 0; i < horizontal.length; i++) {
      for (let j = 0; j < vertical.length; j++) {
        if (horizontal[i] === vertical[j]) {
          commonLetterFound = true;
          console.log(`Words share the letter "${horizontal[i]}" at positions: horizontal ${i+1}, vertical ${j+1}`);
          break;
        }
      }
      if (commonLetterFound) break;
    }
    
    if (!commonLetterFound) {
      console.warn('\nWARNING: Words do not share any common letters. They will not be able to cross properly.');
    }
    
    rl.question('Enter relation between words: ', (relation) => {
      relation = relation.trim();
      
      if (!relation) {
        console.error('Error: Relation cannot be empty.');
        rl.close();
        process.exit(1);
      }
      
      // Create the new puzzle
      const newPuzzle = {
        id: newId,
        horizontal,
        vertical,
        relation
      };
      
      // Add to puzzle data
      puzzleData.puzzles.push(newPuzzle);
      
      // Write back to file
      fs.writeFileSync(puzzleFilePath, JSON.stringify(puzzleData, null, 2), 'utf8');
      
      console.log('\nPuzzle added successfully!');
      console.log(`ID: ${newId}`);
      console.log(`Horizontal: ${horizontal}`);
      console.log(`Vertical: ${vertical}`);
      console.log(`Relation: ${relation}`);
      rl.close();
    });
  });
}); 