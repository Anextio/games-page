// Word lists for different game types

// Classic mode (5-letter words)
export const CLASSIC_WORDS = [
  'REACT', 'PLANE', 'STEAM', 'GHOST', 'BRAIN',
  'TRAIN', 'EARTH', 'LIGHT', 'MUSIC', 'SPORT',
  'WATER', 'FLAME', 'CLOUD', 'CHESS', 'DANCE',
  'GREEN', 'OCEAN', 'SPACE', 'WATCH', 'BREAD',
  'PAINT', 'TABLE', 'STORE', 'MOUSE', 'PLANT',
  'SMILE', 'HOUSE', 'FRAME', 'BEACH', 'DREAM'
];

// Numbers mode (4-digit numbers)
export const NUMBER_WORDS = [
  '1234', '5678', '9012', '3456', '7890',
  '2468', '1357', '8642', '9753', '1029',
  '3698', '4567', '8901', '2345', '6789',
  '1470', '2581', '3692', '4703', '5814',
  '6925', '7036', '8147', '9258', '0369',
  '1592', '4826', '7159', '3718', '6027'
];

// Speed mode (4-letter words)
export const SPEED_WORDS = [
  'FAST', 'JUMP', 'RACE', 'DASH', 'RUSH',
  'ZOOM', 'PACE', 'SNAP', 'BOLT', 'BEAT',
  'WHIZ', 'DART', 'WIND', 'BUZZ', 'SKIP',
  'SOAR', 'PASS', 'SLAM', 'FIRE', 'SPIN',
  'TRIP', 'WHIP', 'JUMP', 'SHOT', 'FLEX',
  'HUNT', 'SWIM', 'JOLT', 'DASH', 'HURL'
];

// Double mode (pairs of related 5-letter words)
export const DOUBLE_WORDS = [
  { word1: 'BREAD', word2: 'TOAST', relation: 'Food items' },
  { word1: 'BLACK', word2: 'WHITE', relation: 'Colors' },
  { word1: 'HAPPY', word2: 'SMILE', relation: 'Emotions' },
  { word1: 'BEACH', word2: 'OCEAN', relation: 'Coastal features' },
  { word1: 'WATER', word2: 'DRINK', relation: 'Liquids' },
  { word1: 'NIGHT', word2: 'DREAM', relation: 'Sleep related' },
  { word1: 'HORSE', word2: 'RIDER', relation: 'Equestrian' },
  { word1: 'CLOUD', word2: 'STORM', relation: 'Weather' },
  { word1: 'PLANT', word2: 'BLOOM', relation: 'Botany' },
  { word1: 'MUSIC', word2: 'DANCE', relation: 'Arts' },
  { word1: 'TRAIN', word2: 'TRACK', relation: 'Transportation' },
  { word1: 'CHAIR', word2: 'TABLE', relation: 'Furniture' },
  { word1: 'PHONE', word2: 'VOICE', relation: 'Communication' },
  { word1: 'RIVER', word2: 'BRIDGE', relation: 'Geography' },
  { word1: 'FLAME', word2: 'SMOKE', relation: 'Fire' }
];

// Hard mode (6-letter words)
export const HARD_WORDS = [
  'SYSTEM', 'CODING', 'GITHUB', 'SYNTAX', 'BROWSER',
  'DEPLOY', 'COMMIT', 'BRANCH', 'SCRIPT', 'LAMBDA',
  'CURSOR', 'PYTHON', 'ROUTER', 'KERNEL', 'SOCKET',
  'MODULE', 'LAYOUT', 'COOKIE', 'SERVER', 'DOMAIN',
  'OBJECT', 'MATRIX', 'STRUCT', 'RENDER', 'CLIENT',
  'STREAM', 'THREAD', 'ACCESS', 'FORMAT', 'FILTER'
];

// Definition mode (5-letter words with definitions)
export const DEFINITION_WORDS = [
  { word: 'ACUTE', definition: 'Having a sharp point or end' },
  { word: 'BLAZE', definition: 'A bright, hot flame or fire' },
  { word: 'CHASE', definition: 'To pursue something or someone' },
  { word: 'DELVE', definition: 'To dig or search deeply' },
  { word: 'EVOKE', definition: 'To bring or recall a feeling, memory, or image to the mind' },
  { word: 'FORGE', definition: 'To form metal by heating and hammering' },
  { word: 'GRAZE', definition: 'To feed on growing grasses' },
  { word: 'HINGE', definition: 'A movable joint that connects linked objects' },
  { word: 'IDEAL', definition: 'A standard of perfection or excellence' },
  { word: 'JOLLY', definition: 'Happy and cheerful' },
  { word: 'KNACK', definition: 'An acquired skill or ability' },
  { word: 'LUCID', definition: 'Very clear and easy to understand' },
  { word: 'MOURN', definition: 'To feel or express deep sorrow' },
  { word: 'NOBLE', definition: 'Having high moral qualities or character' },
  { word: 'ORBIT', definition: 'The curved path of an object around a point in space' }
];

// Chain mode (5-letter words for chain puzzles)
export const CHAIN_WORDS = [
  'CHAIN', 'NOBLE', 'EARTH', 'HOUSE', 'ENTRY',
  'YOUTH', 'HAPPY', 'YOUNG', 'GHOST', 'TREAD',
  'DOUGH', 'HEART', 'TRACK', 'KNOCK', 'KNIFE',
  'EAGER', 'ROUND', 'DOZEN', 'NIGHT', 'TRUCE',
  'EXTRA', 'ABORT', 'TOAST', 'TRUST', 'TRADE',
  'EVERY', 'YACHT', 'TIGER', 'RIDER', 'RANGE'
];

// Backwards mode (5-letter words that make sense backwards)
export const BACKWARDS_WORDS = [
  'SMART', 'TRAMS', 'LEVER', 'REVEL', 'RECAP',
  'PAGER', 'STRAW', 'PARTS', 'FLOW', 'WOLF',
  'DELIVER', 'REVILED', 'DRAWER', 'REWARD', 'STAR',
  'RATS', 'POTS', 'STOP', 'LOOP', 'POOL',
  'LIVED', 'DEVIL', 'MOOD', 'DOOM', 'REGAL',
  'LAGER', 'NAME', 'EMAN', 'LOOT', 'TOOL'
];

// Waffle mode (grid words)
export const WAFFLE_WORDS = [
  { horizontal: ['APPLE', 'BREAD', 'CHAIR'], vertical: ['ABOUT', 'PLANT', 'EARTH'] },
  { horizontal: ['DREAM', 'FLOAT', 'SPORT'], vertical: ['DROPS', 'FLASH', 'TRAIN'] },
  { horizontal: ['GHOST', 'AMBER', 'METAL'], vertical: ['GAMES', 'BLAME', 'ROYAL'] },
  { horizontal: ['PAINT', 'LEARN', 'ORGAN'], vertical: ['PLANE', 'AGONY', 'TRAIN'] },
  { horizontal: ['WASTE', 'IDEAL', 'NOISE'], vertical: ['WINGS', 'ADORE', 'ESSAY'] },
  { horizontal: ['FIRST', 'ALLOW', 'TOWER'], vertical: ['FAULT', 'IVORY', 'TREND'] },
  { horizontal: ['CHILD', 'LASER', 'OPEN'], vertical: ['CLASP', 'HASTE', 'DINER'] },
  { horizontal: ['BRAIN', 'LUNAR', 'UNITE'], vertical: ['BLUNT', 'RANGE', 'NIGHT'] },
  { horizontal: ['SPACE', 'TRAIL', 'ANGLE'], vertical: ['STAGE', 'PRICE', 'EAGLE'] },
  { horizontal: ['PRIME', 'AUDIO', 'TENTH'], vertical: ['PATCH', 'RIDER', 'MOUTH'] }
]; 