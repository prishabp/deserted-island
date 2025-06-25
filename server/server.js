require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Player = require('./models/Player');
const { processCommand } = require('./gameLogic');
const { initializeLevelItems } = require('./gameLogic');
const app = express();
app.use(cors());
app.use(express.json());

connectDB();
initializeLevelItems();
// Player login endpoint
app.post('/api/player', async (req, res) => {
  try {
    let player = await Player.findOne({ username: req.body.username });
    
    if (!player) {
      player = new Player({
        username: req.body.username,
        gameTime: new Date(0) // Start at 00:00
      });
      await player.save();
    }
    
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Command processing endpoint
app.post('/api/command', async (req, res) => {
  try {
    const player = await Player.findById(req.body.playerId);
    
    // Update lastActive first
    player.lastActive = Date.now();
    await player.save();
    
    const response = await processCommand(player, req.body.command);
    await player.save();
    
    res.json({ response, playerState: player });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.post('/api/player/reset', async (req, res) => {
  try {
    const { username } = req.body;
    const result = await Player.deleteOne({ username });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json({ message: `Player ${username} reset successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));