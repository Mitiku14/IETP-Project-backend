const mongoose = require('mongoose');

const deviceStateSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      default: 'roof-system-001', // Only one system for this project
    },
    // ⚙️ Control Settings
    pumpStatus: {
      type: Boolean,
      default: false, // false = OFF, true = ON
    },
    automaticMode: {
      type: Boolean,
      default: true, // true = System decides when to water
    },
    moistureThreshold: {
      type: Number,
      default: 30, // Pump turns on if moisture < 30%
    },

    // 🌧️ Weather API Feature
    weatherCheckEnabled: {
      type: Boolean,
      default: true, // If true, check internet weather before watering
    },

    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model('DeviceState', deviceStateSchema);
