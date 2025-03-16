// Initialize word sets for different length words
const FIVE_LETTER_WORDS = new Set<string>()
const FOUR_LETTER_WORDS = new Set<string>()

// Our curated lists of common words
const CURATED_FIVE_LETTER_WORDS = new Set<string>([
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
  'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
  'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware',
  'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began', 'begin', 'begun', 'being',
  'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blind', 'block', 'blood', 'board',
  'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brief', 'bring',
  'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch',
  'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child',
  'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock', 'close',
  'cloud', 'coach', 'coast', 'color', 'could', 'count', 'court', 'cover', 'craft', 'crash',
  'cream', 'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance', 'dated',
  'dream', 'drink', 'drive', 'early', 'earth', 'eight', 'email', 'empty', 'enjoy', 'enter',
  'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault',
  'field', 'fight', 'final', 'first', 'flash', 'fleet', 'floor', 'focus', 'force', 'frame',
  'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given', 'glass', 'globe', 'going',
  'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'group', 'guess', 'guest',
  'guide', 'happy', 'heart', 'heavy', 'hello', 'horse', 'hotel', 'house', 'human', 'ideal',
  'image', 'index', 'inner', 'input', 'issue', 'japan', 'joint', 'jones', 'judge', 'known',
  'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave',
  'legal', 'level', 'light', 'limit', 'local', 'logic', 'loose', 'lucky', 'lunch', 'magic',
  'major', 'maker', 'march', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might',
  'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse',
  'mouth', 'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted',
  'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other', 'paint', 'panel',
  'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place',
  'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride',
  'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet',
  'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right',
  'river', 'robot', 'roger', 'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale',
  'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp',
  'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight',
  'since', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smoke', 'solid', 'solve',
  'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split',
  'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel',
  'stick', 'still', 'stock', 'stone', 'store', 'storm', 'story', 'strip', 'study', 'style',
  'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'teach', 'teeth', 'thank',
  'theme', 'there', 'thick', 'thing', 'think', 'third', 'those', 'three', 'throw', 'tight',
  'times', 'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track',
  'trade', 'train', 'treat', 'trend', 'trial', 'tried', 'truck', 'truly', 'trust', 'truth',
  'twice', 'under', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid',
  'value', 'video', 'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel',
  'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry',
  'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young',
  'youth'
])

// Common 4-letter words for Speed Wordle
const CURATED_FOUR_LETTER_WORDS = new Set<string>([
  'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball',
  'band', 'bank', 'base', 'bath', 'bear', 'beat', 'been', 'beer', 'bell', 'belt',
  'best', 'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'bomb', 'bond', 'bone',
  'book', 'boom', 'born', 'boss', 'both', 'bowl', 'bulk', 'burn', 'bush', 'busy',
  'call', 'calm', 'came', 'camp', 'card', 'care', 'case', 'cash', 'cast', 'cell',
  'chat', 'chip', 'city', 'club', 'coal', 'coat', 'code', 'cold', 'come', 'cook',
  'cool', 'cope', 'copy', 'core', 'cost', 'crew', 'crop', 'dark', 'data', 'date',
  'dawn', 'days', 'dead', 'deal', 'dean', 'dear', 'debt', 'deep', 'deny', 'desk',
  'dial', 'diet', 'dirt', 'disc', 'disk', 'does', 'done', 'door', 'dose', 'down',
  'draw', 'drew', 'drop', 'drug', 'dual', 'duke', 'dust', 'duty', 'each', 'earn',
  'ease', 'east', 'easy', 'edge', 'else', 'even', 'ever', 'evil', 'exit', 'face',
  'fact', 'fade', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed',
  'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire',
  'firm', 'fish', 'five', 'flat', 'flow', 'food', 'foot', 'ford', 'form', 'fort',
  'four', 'free', 'from', 'fuel', 'full', 'fund', 'gain', 'game', 'gate', 'gave',
  'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold', 'golf',
  'gone', 'good', 'gray', 'grew', 'grey', 'grow', 'gulf', 'hair', 'half', 'hall',
  'hand', 'hang', 'hard', 'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held',
  'hell', 'help', 'here', 'hero', 'high', 'hill', 'hire', 'hold', 'hole', 'holy',
  'home', 'hope', 'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea', 'inch',
  'into', 'iron', 'item', 'jack', 'jane', 'jean', 'john', 'join', 'jump', 'jury',
  'just', 'keen', 'keep', 'kent', 'kept', 'kick', 'kill', 'kind', 'king', 'knee',
  'knew', 'know', 'lack', 'lady', 'laid', 'lake', 'land', 'lane', 'last', 'late',
  'lead', 'left', 'less', 'life', 'lift', 'like', 'line', 'link', 'list', 'live',
  'load', 'loan', 'lock', 'logo', 'long', 'look', 'lord', 'lose', 'loss', 'lost',
  'love', 'luck', 'made', 'mail', 'main', 'make', 'male', 'many', 'mark', 'mass',
  'matt', 'meal', 'mean', 'meat', 'meet', 'menu', 'mere', 'mike', 'mile', 'milk',
  'mill', 'mind', 'mine', 'miss', 'mode', 'mood', 'moon', 'more', 'most', 'move',
  'much', 'must', 'name', 'navy', 'near', 'neck', 'need', 'news', 'next', 'nice',
  'nick', 'nine', 'none', 'nose', 'note', 'okay', 'once', 'only', 'onto', 'open',
  'oral', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'palm', 'park',
  'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'pipe', 'plan', 'play',
  'plot', 'plug', 'plus', 'poll', 'pool', 'poor', 'port', 'post', 'pull', 'pure',
  'push', 'race', 'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real', 'rear',
  'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'ring', 'rise', 'risk', 'road',
  'rock', 'role', 'roll', 'roof', 'room', 'root', 'rose', 'rule', 'rush', 'ruth',
  'safe', 'said', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'seat', 'seed',
  'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'sept', 'ship', 'shop',
  'shot', 'show', 'shut', 'sick', 'side', 'sign', 'site', 'size', 'skin', 'slip',
  'slow', 'snow', 'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'sort',
  'soul', 'spot', 'star', 'stay', 'step', 'stop', 'such', 'suit', 'sure', 'take',
  'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tech', 'tell', 'tend',
  'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this',
  'thus', 'time', 'tiny', 'told', 'tone', 'tony', 'took', 'tool', 'tour', 'town',
  'tree', 'trip', 'true', 'tune', 'turn', 'twin', 'type', 'unit', 'upon', 'used',
  'user', 'vary', 'vast', 'very', 'vice', 'view', 'vote', 'wage', 'wait', 'wake',
  'walk', 'wall', 'want', 'ward', 'warm', 'wash', 'wave', 'ways', 'weak', 'wear',
  'week', 'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife',
  'wild', 'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word',
  'wore', 'work', 'yard', 'yeah', 'year', 'your', 'zero', 'zone'
])

// Initialize word sets with our curated lists
function initializeWordLists() {
  // Add all 5-letter words
  CURATED_FIVE_LETTER_WORDS.forEach(word => FIVE_LETTER_WORDS.add(word.toLowerCase()))
  
  // Add all 4-letter words
  CURATED_FOUR_LETTER_WORDS.forEach(word => FOUR_LETTER_WORDS.add(word.toLowerCase()))
  
  console.log(`Loaded ${FIVE_LETTER_WORDS.size} five-letter words and ${FOUR_LETTER_WORDS.size} four-letter words`)
}

// Initialize the word lists when this module is loaded
initializeWordLists()

export function isValidWord(word: string, length = 5): boolean {
  // Check if it's a number for number wordle
  if (/^\d+$/.test(word)) {
    return true
  }
  
  const normalized = word.toLowerCase()
  
  // Check if the word is in our dictionary based on length
  if (length === 5) {
    return FIVE_LETTER_WORDS.has(normalized)
  } else if (length === 4) {
    return FOUR_LETTER_WORDS.has(normalized)
  }
  
  return false
}

export function getRandomWord(gameType: string = 'classic'): string {
  // Choose the appropriate word list based on game type
  if (gameType === 'speed') {
    // Speed wordle uses 4-letter words
    const words = Array.from(FOUR_LETTER_WORDS)
    return words[Math.floor(Math.random() * words.length)]
  }
  
  // Default to 5-letter words for other game types
  const words = Array.from(FIVE_LETTER_WORDS)
  return words[Math.floor(Math.random() * words.length)]
}

// For development/testing: get word list size
export function getWordListSize(length = 5): number {
  return length === 5 ? FIVE_LETTER_WORDS.size : FOUR_LETTER_WORDS.size
}

// For development: get all valid words
export function getAllWords(length = 5): string[] {
  return Array.from(length === 5 ? FIVE_LETTER_WORDS : FOUR_LETTER_WORDS)
} 