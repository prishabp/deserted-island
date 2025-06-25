const Player = require('./models/Player');
const worldItems = {};
let nextItemId = 1;
// Initialize item map
const itemMap = {};
let itemIdCounter = 1;
// Game constants

const ROOM_REQUIREMENTS = {
  1: { alpha: 1, beta: 1 },
  2: { alpha: 2, beta: 2 },
  3: { alpha: 3, beta: 3 }
};

const NPC_HINTS = {
  1: "Time is important, slow and steady wins the race.",
  2: "Time is important, it doesn't wait for you.",
  3: "Time is important, I wish I could go back.",
  4: "It's time I leave."
};

// Room coordinates for each level (x1, x2, y1, y2)
const LEVEL_ROOMS = {
  1: {
    1: { 
      area: { x1: 5, x2: 7, y1: 5, y2: 7 },
      doors: [{x: 6, y: 4}], // Single door at top
      walls: [
        // Top wall with door opening
        {x1: 4, x2: 8, y1: 4, y2: 4, exclude: [{x:6, y:4}]},
        // Bottom wall
        {x1: 4, x2: 8, y1: 8, y2: 8},
        // Left wall
        {x1: 4, x2: 4, y1: 5, y2: 7},
        // Right wall
        {x1: 8, x2: 8, y1: 5, y2: 7}
      ]
    },
    2: { 
      area: { x1: 12, x2: 14, y1: 5, y2: 7 },
      doors: [{x: 13, y: 8}], // Single door at bottom
      walls: [
        {x1: 11, x2: 15, y1: 4, y2: 4},
        {x1: 11, x2: 15, y1: 8, y2: 8, exclude: [{x:13, y:8}]},
        {x1: 11, x2: 11, y1: 5, y2: 7},
        {x1: 15, x2: 15, y1: 5, y2: 7}
      ]
    },
    3: { 
      area: { x1: 5, x2: 7, y1: 12, y2: 14 },
      doors: [{x: 4, y: 13}], // Single door at left
      walls: [
        {x1: 4, x2: 8, y1: 11, y2: 11},
        {x1: 4, x2: 8, y1: 15, y2: 15},
        {x1: 4, x2: 4, y1: 12, y2: 14, exclude: [{x:4, y:13}]},
        {x1: 8, x2: 8, y1: 12, y2: 14}
      ]
    }
  },
  // Add similar definitions for other levels
  2: {
    1: { 
      area: { x1: 4, x2: 6, y1: 4, y2: 6 },
      doors: [{x: 5, y: 3}], // Top door
      walls: [
        // Top wall with door opening
        {x1: 3, x2: 7, y1: 3, y2: 3, exclude: [{x:5, y:3}]},
        // Bottom wall
        {x1: 3, x2: 7, y1: 7, y2: 7},
        // Left wall
        {x1: 3, x2: 3, y1: 4, y2: 6},
        // Right wall
        {x1: 7, x2: 7, y1: 4, y2: 6}
      ]
    },
    2: { 
      area: { x1: 13, x2: 15, y1: 4, y2: 6 },
      doors: [{x: 14, y: 7}], // Bottom door
      walls: [
        // Top wall
        {x1: 12, x2: 16, y1: 3, y2: 3},
        // Bottom wall with door opening
        {x1: 12, x2: 16, y1: 7, y2: 7, exclude: [{x:14, y:7}]},
        // Left wall
        {x1: 12, x2: 12, y1: 4, y2: 6},
        // Right wall
        {x1: 16, x2: 16, y1: 4, y2: 6}
      ]
    },
    3: { 
      area: { x1: 4, x2: 6, y1: 13, y2: 15 },
      doors: [{x: 3, y: 14}], // Left door
      walls: [
        // Top wall
        {x1: 3, x2: 7, y1: 12, y2: 12},
        // Bottom wall
        {x1: 3, x2: 7, y1: 16, y2: 16},
        // Left wall with door opening
        {x1: 3, x2: 3, y1: 13, y2: 15, exclude: [{x:3, y:14}]},
        // Right wall
        {x1: 7, x2: 7, y1: 13, y2: 15}
      ]
    }
  },
  3: {
    1: { 
      area: { x1: 5, x2: 7, y1: 5, y2: 7 },
      doors: [{x: 6, y: 4}], // Single door at top
      walls: [
        // Top wall with door opening
        {x1: 4, x2: 8, y1: 4, y2: 4, exclude: [{x:6, y:4}]},
        // Bottom wall
        {x1: 4, x2: 8, y1: 8, y2: 8},
        // Left wall
        {x1: 4, x2: 4, y1: 5, y2: 7},
        // Right wall
        {x1: 8, x2: 8, y1: 5, y2: 7}
      ]
    },
    2: { 
      area: { x1: 12, x2: 14, y1: 5, y2: 7 },
      doors: [{x: 13, y: 8}], // Single door at bottom
      walls: [
        {x1: 11, x2: 15, y1: 4, y2: 4},
        {x1: 11, x2: 15, y1: 8, y2: 8, exclude: [{x:13, y:8}]},
        {x1: 11, x2: 11, y1: 5, y2: 7},
        {x1: 15, x2: 15, y1: 5, y2: 7}
      ]
    },
    3: { 
      area: { x1: 5, x2: 7, y1: 12, y2: 14 },
      doors: [{x: 4, y: 13}], // Single door at left
      walls: [
        {x1: 4, x2: 8, y1: 11, y2: 11},
        {x1: 4, x2: 8, y1: 15, y2: 15},
        {x1: 4, x2: 4, y1: 12, y2: 14, exclude: [{x:4, y:13}]},
        {x1: 8, x2: 8, y1: 12, y2: 14}
      ]
    }
  },
  4: {
    1: { 
      area: { x1: 4, x2: 6, y1: 4, y2: 6 },
      doors: [{x: 5, y: 3}], // Top door
      walls: [
        // Top wall with door opening
        {x1: 3, x2: 7, y1: 3, y2: 3, exclude: [{x:5, y:3}]},
        // Bottom wall
        {x1: 3, x2: 7, y1: 7, y2: 7},
        // Left wall
        {x1: 3, x2: 3, y1: 4, y2: 6},
        // Right wall
        {x1: 7, x2: 7, y1: 4, y2: 6}
      ]
    },
    2: { 
      area: { x1: 13, x2: 15, y1: 4, y2: 6 },
      doors: [{x: 14, y: 7}], // Bottom door
      walls: [
        // Top wall
        {x1: 12, x2: 16, y1: 3, y2: 3},
        // Bottom wall with door opening
        {x1: 12, x2: 16, y1: 7, y2: 7, exclude: [{x:14, y:7}]},
        // Left wall
        {x1: 12, x2: 12, y1: 4, y2: 6},
        // Right wall
        {x1: 16, x2: 16, y1: 4, y2: 6}
      ]
    },
    3: { 
      area: { x1: 4, x2: 6, y1: 13, y2: 15 },
      doors: [{x: 3, y: 14}], // Left door
      walls: [
        // Top wall
        {x1: 3, x2: 7, y1: 12, y2: 12},
        // Bottom wall
        {x1: 3, x2: 7, y1: 16, y2: 16},
        // Left wall with door opening
        {x1: 3, x2: 3, y1: 13, y2: 15, exclude: [{x:3, y:14}]},
        // Right wall
        {x1: 7, x2: 7, y1: 13, y2: 15}
      ]
    }
  }
};

function placeItem(level, x, y, item) {
  if (!itemMap[level]) {
    itemMap[level] = {};
  }

  const key = `${x},${y}`;
  if (!itemMap[level][key]) {
    itemMap[level][key] = [];
  }

  item.id = itemIdCounter++;
  itemMap[level][key].push(item);
}

function findItemAtPosition(x, y, level) {
  if (!itemMap[level]) return null;
  const key = `${x},${y}`;
  const items = itemMap[level][key];
  return items && items.length > 0 ? items[0] : null;
}

function removeItemFromWorld(id) {
  for (const level in itemMap) {
    for (const pos in itemMap[level]) {
      itemMap[level][pos] = itemMap[level][pos].filter(item => item.id !== id);
      if (itemMap[level][pos].length === 0) {
        delete itemMap[level][pos];
      }
    }
    if (Object.keys(itemMap[level]).length === 0) {
      delete itemMap[level];
    }
  }
}

function dropItem(player, indexStr) {
  const index = parseInt(indexStr);
  if (isNaN(index)) {
    throw new Error("Invalid index - must be a number");
  }
  if (index < 0 || index >= player.inventory.length) {
    throw new Error("Invalid inventory index");
  }
  
  const item = player.inventory[index];
  if (!item) {
    throw new Error("No item at that index");
  }
  
  player.inventory.splice(index, 1);
  placeItem(player.currentLevel, player.position.x, player.position.y, {
    ...item,
    originalX: player.position.x,
    originalY: player.position.y,
    originalLevel: player.currentLevel
  });
  
  return `Dropped ${item.type === 'key' ? item.keyType + ' key' : item.type}`;
}

// Helper: Format time as HH:MM
function formatTime(date) {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper: Check if position is in base
function isInBase(x, y) {
  return x >= 9 && x <= 10 && y >= 9 && y <= 10;
}

// Helper: Check if position is in a room
function isInRoom(x, y, level) {
  const rooms = LEVEL_ROOMS[level];
  for (const roomNum in rooms) {
    const room = rooms[roomNum];
    if (x >= room.area.x1 && x <= room.area.x2 && y >= room.area.y1 && y <= room.area.y2) {
      return parseInt(roomNum);
    }
  }
  return 0;
}

function isWall(x, y, level) {
  const rooms = LEVEL_ROOMS[level];
  if (!rooms) return false;
  
  for (const roomNum in rooms) {
    const room = rooms[roomNum];
    if (!room.walls) continue;
    
    for (const wall of room.walls) {
      // Check if position is within wall segment
      const inX = x >= wall.x1 && x <= wall.x2;
      const inY = y >= wall.y1 && y <= wall.y2;
      
      if (inX && inY) {
        // Check if this position is a door opening
        if (wall.exclude) {
          for (const door of wall.exclude) {
            if (door.x === x && door.y === y) {
              return false; // It's a door, not a wall
            }
          }
        }
        return true; // It's a wall
      }
    }
  }
  return false; // Not a wall
}

function isDoor(x, y, level) {
  const rooms = LEVEL_ROOMS[level];
  if (!rooms) return 0;
  
  for (const roomNum in rooms) {
    const room = rooms[roomNum];
    if (room.doors && room.doors.some(door => door.x === x && door.y === y)) {
      return parseInt(roomNum);
    }
  }
  return 0;
}

function getRoomAtPosition(x, y, level) {
  const rooms = LEVEL_ROOMS[level];
  if (!rooms) return 0;
  
  for (const roomNum in rooms) {
    const room = rooms[roomNum];
    const area = room.area;
    if (x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2) {
      return parseInt(roomNum);
    }
  }
  return 0;
}

function reverseInventoryState(player) {
  const currentTime = player.gameTime.getTime();

  const keptItems = [];

  for (const item of player.inventory) {
    if (item.timestamp && item.timestamp.getTime() <= currentTime) {
      keptItems.push(item);
    } else {
      // Put item back into the world at original location
      if (
        item.originalX !== undefined &&
        item.originalY !== undefined &&
        item.originalLevel !== undefined
      ) {
        placeItem(item.originalLevel, item.originalX, item.originalY, {
          type: item.type,
          keyType: item.keyType,
          pickedUpBefore: true, // Mark as previously seen so form lock is bypassed
          content: item.content
        });
      }
    }
  }

  player.inventory = keptItems;
}

// Function to calculate time progress
function calculateTimeProgress(player, command) {
  const timeAffectingCommands = [
    'w', 'a', 's', 'd',
    'pickup', 'drop', 'store', 'retrieve',
    'form', 'portal', 'talk', 'read'
  ];

  const [action] = command.trim().toLowerCase().split(' ');

  if (!timeAffectingCommands.includes(action)) return 0;

  const oldTime = player.gameTime.getTime();
  const { x, y } = player.position;

  let timeChangeMinutes = 10; // default

  if (isInBase(x, y)) {
    timeChangeMinutes = 0; // base is safe zone
  } else {
    const roomNum = getRoomAtPosition(x, y, player.currentLevel);

    if (roomNum > 0) {
      switch (player.currentLevel) {
        case 1: timeChangeMinutes = 15; break;
        case 2: timeChangeMinutes = 5; break;
        case 3: timeChangeMinutes = -10; break;
        case 4: timeChangeMinutes = (x % 2 === 0) ? 15 : 5; break;
      }
    } else {
      // hallway logic (for level 1 & 2)
      if (player.currentLevel === 2) timeChangeMinutes = 5;
      if (player.currentLevel === 3) timeChangeMinutes = -10;
    }
  }

  // Apply time change
  player.gameTime = new Date(oldTime + timeChangeMinutes * 60000);

  // Reverse time bonus
  if (timeChangeMinutes < 0 && player.currentLevel >= 3) {
    reverseInventoryState(player);
  }

  return timeChangeMinutes * 60000;
}

// Check room access
function checkRoomAccess(player, roomNum) {
  const requirements = ROOM_REQUIREMENTS[roomNum];
  
  const alphaKeys = player.inventory.filter(i => 
    i.type === 'key' && i.keyType === 'Alpha'
  ).length;
  
  const betaKeys = player.inventory.filter(i => 
    i.type === 'key' && i.keyType === 'Beta'
  ).length;
  
  return alphaKeys >= requirements.alpha && betaKeys >= requirements.beta;
}

// Activate portal
function activatePortal(player) {
  if (player.currentLevel >= 4) {
    // Game completed
    return "Congratulations! You've stabilized the time anomalies and escaped the island!";
  }
  
  // Advance to next level
  player.currentLevel++;
  player.position = { x: 10, y: 10 }; // Reset to center
  
  // Remove keys from inventory (consumed by portal)
  player.inventory = player.inventory.filter(item => item.type !== 'key');
  
  return `Portal activated! Welcome to Level ${player.currentLevel}`;
}

// Movement handler with room access check
function movePlayer(player, dx, dy) {
  const oldX = player.position.x;
  const oldY = player.position.y;
  const newX = oldX + dx;
  const newY = oldY + dy;

  // Boundary check
  if (newX < 0 || newX > 19 || newY < 0 || newY > 19) {
    throw new Error("Cannot move further - edge of map");
  }

  // Wall check
  if (isWall(newX, newY, player.currentLevel)) {
    throw new Error("Wall here, can't pass");
  }

  // Door check
  const doorRoom = isDoor(newX, newY, player.currentLevel);
  if (doorRoom > 0) {
    if (!checkRoomAccess(player, doorRoom)) {
      throw new Error(
        `You need ${ROOM_REQUIREMENTS[doorRoom].alpha} Alpha and ${ROOM_REQUIREMENTS[doorRoom].beta} Beta keys to enter Room ${doorRoom}`
      );
    }
  }

  // Update position
  player.position = { x: newX, y: newY };

  // Room entry message
  const newRoom = getRoomAtPosition(newX, newY, player.currentLevel);
  const oldRoom = getRoomAtPosition(oldX, oldY, player.currentLevel);
  let roomMessage = '';

  if (newRoom > 0 && newRoom !== oldRoom) {
    roomMessage = `\nEntered Room ${newRoom}`;
    if (newRoom === 3) {
      roomMessage += " - Portal Chamber. Something doesn't feel right here...";
    }
  }

  if (isInBase(newX, newY)) {
    roomMessage += `\nIn base.`;
  }

  // Item detection
  const itemHere = findItemAtPosition(newX, newY, player.currentLevel);
  let itemMessage = '';
  if (itemHere) {
    if (itemHere.type === 'scroll') {
      itemMessage = "\nA scroll lies here.";
    } else if (itemHere.type === 'key') {
      itemMessage = `\nAn ${itemHere.keyType} key glints nearby...`;
    } else {
      itemMessage = `\nYou notice something here...`;
    }
  }

  return `Moved to (${newX}, ${newY}).${roomMessage}${itemMessage}`;
}

// Store item from inventory to storage
function storeItem(player, indexStr) {
    const index = parseInt(indexStr);
    
    // Validate position (must be in base)
    if (!isInBase(player.position.x, player.position.y)) {
        throw new Error("Storage only accessible in base");
    }

    // Validate index
    if (isNaN(index) || index < 0 || index >= player.inventory.length) {
        throw new Error(`Invalid inventory index: ${index}`);
    }

    // Get the item
    const item = player.inventory[index];
    
    // Add to storage with current timestamp
    player.storage.push({
        type: item.type,
        keyType: item.keyType,
        timestamp: new Date(player.gameTime),
        content: item.content
    });

    // Remove from inventory
    player.inventory.splice(index, 1);

    return `Stored ${item.keyType || ''} ${item.type}`;
}

// Retrieve item from storage to inventory
function retrieveItem(player, indexStr) {
    const index = parseInt(indexStr);
    
    // Validate position (must be in base)
    if (!isInBase(player.position.x, player.position.y)) {
        throw new Error("Retrieval only possible in base");
    }

    // Validate index
    if (isNaN(index) || index < 0 || index >= player.storage.length) {
        throw new Error(`Invalid storage index: ${index}`);
    }

    // Get the item
    const item = player.storage[index];
    
    // Add to inventory with current timestamp
    player.inventory.push({
        type: item.type,
        keyType: item.keyType,
        timestamp: new Date(player.gameTime),
        content: item.content
    });

    // Remove from storage
    player.storage.splice(index, 1);

    return `Retrieved ${item.keyType || ''} ${item.type}`;
}

// Try to activate portal
function tryActivatePortal(player) {
  try {
    const roomNum = isInRoom(player.position.x, player.position.y, player.currentLevel);
    
    if (roomNum !== 3) {
      throw new Error('Portal can only be activated in Room 3');
    }
    
    // Check if current time matches portal opening times
    const portalTimes = [
      '01:10', '03:20', '06:30', '07:10', '11:30', 
      '13:40', '15:20', '17:00', '20:20', '21:30', '23:40'
    ];
    const currentTime = formatTime(player.gameTime);
    
    if (!portalTimes.includes(currentTime)) {
      throw new Error(`Portal can only be activated at specific times: ${portalTimes.join(', ')}. Current time: ${currentTime}`);
    }
    
    const alphaKeys = player.inventory.filter(i => 
      i.type === 'key' && i.keyType === 'Alpha'
    ).length;
    
    const betaKeys = player.inventory.filter(i => 
      i.type === 'key' && i.keyType === 'Beta'
    ).length;
    
    if (alphaKeys < 5 || betaKeys < 5) {
      throw new Error(`Portal requires 5 Alpha and 5 Beta keys. You have ${alphaKeys} Alpha and ${betaKeys} Beta keys`);
    }
    
    return activatePortal(player);
    
  } catch (portalError) {
    throw portalError;
  }
}

// Item pickup
function pickupItem(player) {
  try {
    // Get current position
    const { x, y } = player.position;
    
    // Find item at current position
    const item = findItemAtPosition(x, y, player.currentLevel);
    
    if (!item) {
      throw new Error('No items at this position');
    }
    
    if (item.type === 'key') {
      // Check form restriction for initial pickup
      if (!item.pickedUpBefore && item.keyType !== player.form) {
        throw new Error(`Cannot pick up ${item.keyType} key in ${player.form} form`);
      }
      item.pickedUpBefore = true;
    }
    
    player.inventory.push({
      type: item.type,
      keyType: item.type === 'key' ? item.keyType : undefined,
      timestamp: new Date(player.gameTime),
      content: item.content,
      originalX: x,
      originalY: y,
      originalLevel: player.currentLevel
    });
    
    // Remove item from world
    removeItemFromWorld(item.id);
    
    return `Picked up ${item.type === 'key' ? item.keyType + ' key' : 'scroll'}`;
    
  } catch (pickupError) {
    throw pickupError;
  }
}

// Form switching
function switchForm(player) {
  try {
    if (!isInBase(player.position.x, player.position.y)) {
      throw new Error('Form switching only available in base');
    }
    
    player.form = player.form === 'Alpha' ? 'Beta' : 'Alpha';
    return `Switched to ${player.form} form`;
    
  } catch (formError) {
    throw formError;
  }
}

// NPC interaction
function talkToNPC(player) {
  return NPC_HINTS[player.currentLevel];
}

// Help command
function helpCommand() {
    return `Available commands:
W/A/S/D - Move
Talk - Talk to NPC
Pickup - Pick up items
Drop [index] - Drop an item
Store [index] - Store item in base
Retrieve [index] - Retrieve from storage
Form - Switch forms (Alpha/Beta)
Read [index] - Read a scroll
Portal - Activate portal (Room 3)
Help - Show this help`;
}

function handleError(action, error) {
  console.error(`[${action}] Error: ${error.message}`);
  return error.message;
}

function validateCommand(player, command) {
  if (!command || typeof command !== 'string') {
    throw new Error('Invalid command format');
  }
  
  const validCommands = ['w', 'a', 's', 'd', 'talk', 'pickup', 'drop', 
                       'store', 'form', 'read', 'retrieve', 'help', 'portal'];
  const [action] = command.trim().toLowerCase().split(' ');
  
  if (!validCommands.includes(action)) {
    throw new Error(`Unknown command: ${action}. Type "help" for available commands`);
  }
  
  if (!player) {
    throw new Error('Player not initialized');
  }
}

function validatePosition(x, y) {
  if (x < 0 || x > 19 || y < 0 || y > 19) {
    throw new Error('Position out of bounds');
  }
}

function validateInventoryIndex(player, index, action) {
  if (isNaN(index) || index < 0 || index >= player.inventory.length) {
    throw new Error(`Invalid inventory index for ${action}`);
  }
}

function validateStorageIndex(player, index, action) {
  if (isNaN(index) || index < 0 || index >= player.storage.length) {
    throw new Error(`Invalid storage index for ${action}`);
  }
}

function initializeLevelItems() {
  // Clear existing items
  for (const level in itemMap) {
    delete itemMap[level];
  }
  itemIdCounter = 1;
  const positions = {
    1: {
      keys: [
        { x: 3, y: 3, type: 'key', keyType: 'Alpha' },
        { x: 15, y: 15, type: 'key', keyType: 'Beta' },
        { x: 6, y: 6, type: 'key', keyType: 'Alpha' },   // Room 1
        { x: 13, y: 6, type: 'key', keyType: 'Beta' },   // Room 2
        { x: 6, y: 13, type: 'key', keyType: 'Alpha' },  // Room 3
        { x: 2, y: 17, type: 'key', keyType: 'Beta' },
        { x: 17, y: 2, type: 'key', keyType: 'Alpha' },
        { x: 18, y: 17, type: 'key', keyType: 'Beta' },
        { x: 5, y: 17, type: 'key', keyType: 'Alpha' },
        { x: 17, y: 5, type: 'key', keyType: 'Beta' }
      ],
      scroll: {
        x: 7, y: 13,
        type: 'scroll',
        content: 'Portal opens at: 01:10, 03:20, 06:30, 07:10, 11:30, 13:40, 15:20, 17:00, 20:20, 21:30, 23:40'
      }
    },
    2: {
      keys: [
        { x: 3, y: 3, type: 'key', keyType: 'Alpha' },
        { x: 15, y: 15, type: 'key', keyType: 'Beta' },
        { x: 5, y: 5, type: 'key', keyType: 'Alpha' },    // Room 1
        { x: 14, y: 5, type: 'key', keyType: 'Beta' },    // Room 2
        { x: 5, y: 14, type: 'key', keyType: 'Alpha' },   // Room 3
        { x: 2, y: 17, type: 'key', keyType: 'Beta' },
        { x: 17, y: 2, type: 'key', keyType: 'Alpha' },
        { x: 18, y: 17, type: 'key', keyType: 'Beta' },
        { x: 5, y: 17, type: 'key', keyType: 'Alpha' },
        { x: 17, y: 5, type: 'key', keyType: 'Beta' }
      ],
      scroll: {
        x: 6, y: 14,
        type: 'scroll',
        content: 'Portal opens at: 01:10, 03:20, 06:30, 07:10, 11:30, 13:40, 15:20, 17:00, 20:20, 21:30, 23:40'
      }
    },
    3: {
      keys: [
        { x: 3, y: 3, type: 'key', keyType: 'Alpha' },
        { x: 15, y: 15, type: 'key', keyType: 'Beta' },
        { x: 6, y: 6, type: 'key', keyType: 'Alpha' },   // Room 1
        { x: 13, y: 6, type: 'key', keyType: 'Beta' },   // Room 2
        { x: 6, y: 13, type: 'key', keyType: 'Alpha' },  // Room 3
        { x: 2, y: 17, type: 'key', keyType: 'Beta' },
        { x: 17, y: 2, type: 'key', keyType: 'Alpha' },
        { x: 18, y: 17, type: 'key', keyType: 'Beta' },
        { x: 5, y: 17, type: 'key', keyType: 'Alpha' },
        { x: 17, y: 5, type: 'key', keyType: 'Beta' }
      ],
      scroll: {
        x: 7, y: 13,
        type: 'scroll',
        content: 'Portal opens at: 01:10, 03:20, 06:30, 07:10, 11:30, 13:40, 15:20, 17:00, 20:20, 21:30, 23:40'
      }
    },
    4: {
      keys: [
        { x: 3, y: 3, type: 'key', keyType: 'Alpha' },
        { x: 15, y: 15, type: 'key', keyType: 'Beta' },
        { x: 5, y: 5, type: 'key', keyType: 'Alpha' },   // Room 1
        { x: 14, y: 5, type: 'key', keyType: 'Beta' },   // Room 2
        { x: 5, y: 14, type: 'key', keyType: 'Alpha' },  // Room 3
        { x: 2, y: 17, type: 'key', keyType: 'Beta' },
        { x: 17, y: 2, type: 'key', keyType: 'Alpha' },
        { x: 18, y: 17, type: 'key', keyType: 'Beta' },
        { x: 5, y: 17, type: 'key', keyType: 'Alpha' },
        { x: 17, y: 5, type: 'key', keyType: 'Beta' }
      ],
      scroll: {
        x: 6, y: 14,
        type: 'scroll',
        content: 'Portal opens at: 01:10, 03:20, 06:30, 07:10, 11:30, 13:40, 15:20, 17:00, 20:20, 21:30, 23:40'
      }
    }
  };

  for (const level in positions) {
    const levelNum = parseInt(level);
    const { keys, scroll } = positions[level];
    
    // Place keys
    keys.forEach(k => {
      placeItem(levelNum, k.x, k.y, { 
        ...k, 
        pickedUpBefore: false 
      });
    });
    
    // Place scroll
    placeItem(levelNum, scroll.x, scroll.y, {
      type: 'scroll',
      content: scroll.content
    });
  }
}

function readScroll(player, indexStr) {
  const index = parseInt(indexStr);

  // Validate index
  if (isNaN(index) || index < 0 || index >= player.inventory.length) {
    throw new Error("Invalid scroll index.");
  }

  const item = player.inventory[index];

  // Must be a scroll
  if (item.type !== 'scroll') {
    throw new Error("That item is not a scroll.");
  }

  // If someone somehow tries to read from storage, check separately
  const stored = player.storage.find((sItem) => sItem.content === item.content);
  if (stored) {
    throw new Error("You must retrieve the scroll to read it.");
  }

  return `You unroll the scroll...\n${item.content}`;
}

exports.initializeLevelItems = initializeLevelItems;
exports.processCommand = async (player, command) => {
  try {
    validateCommand(player, command);
    const timeChangeMs = calculateTimeProgress(player, command);
    const [action, arg] = command.trim().toLowerCase().split(' ');
    let response;
    try {
      switch(action) {
        case 'w': response = movePlayer(player, 0, -1); break;
        case 'a': response = movePlayer(player, -1, 0); break;
        case 's': response = movePlayer(player, 0, 1); break;
        case 'd': response = movePlayer(player, 1, 0); break;
        case 'talk': response = talkToNPC(player); break;
        case 'pickup': response = pickupItem(player); break;
        case 'drop': response = dropItem(player, arg); break;
        case 'store': response = storeItem(player, arg); break;
        case 'form': response = switchForm(player); break;
        case 'read': response = readScroll(player, arg); break;
        case 'retrieve': response = retrieveItem(player, arg); break;
        case 'time-sync': response = "Time synchronized"; break;
        case 'help': response = helpCommand(); break;
        case 'portal': response = tryActivatePortal(player); break;
        default: throw new Error('Command not recognized');
      }
    } catch (cmdError) {
      return handleError(action, cmdError);
    }
    const minutesPassed = Math.abs(timeChangeMs / 60000).toFixed(2);
    const direction = timeChangeMs < 0 ? "reversed" : "advanced";
    return `${response}\nTime ${direction} by ${minutesPassed} minutes`;
  } catch (globalError) {
    return handleError('global', globalError);
  }
};