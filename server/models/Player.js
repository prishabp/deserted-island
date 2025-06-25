const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    position: {
        x: { type: Number, default: 10 },
        y: { type: Number, default: 10 }
    },
    form: { type: String, enum: ['Alpha', 'Beta'], default: 'Alpha' },
    inventory: [{
        type: { type: String, enum: ['key', 'scroll'] },
        keyType: { type: String, enum: ['Alpha', 'Beta'] },
        timestamp: Date,
        content: String,
        originalX: Number,
        originalY: Number,
        originalLevel: Number,
        pickedUpBefore: Boolean
    }],
    storage: [{
        type: { type: String, enum: ['key', 'scroll'] },
        keyType: { type: String, enum: ['Alpha', 'Beta'] },
        timestamp: Date,
        content: String
    }],
    currentLevel: { type: Number, default: 1 },
    gameTime: { type: Date, default: new Date(0) }, // Start at 00:00
    scrollsRead: [{ type: Number }],
    portalsAccessed: [{ type: Number }],
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', PlayerSchema);