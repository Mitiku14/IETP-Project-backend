const mongoose = require('mongoose');

const deviceStateSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      default: 'roof-system-001', 
    },
    
    pumpStatus: {
      type: Boolean,
      default: false, 
    },
    automaticMode: {
      type: Boolean,
      default: true, 
    },
    moistureThreshold: {
      type: Number,
      default: 10, 
    },

    
    weatherCheckEnabled: {
      type: Boolean,
      default: true, 
    },

    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model('DeviceState', deviceStateSchema);
