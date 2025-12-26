// src/controllers/dataController.js
const SensorData = require('../models/SensorData');
const DeviceState = require('../models/DeviceState');

const { checkRainStatus } = require('./weatherController');


exports.postSensorData = async (req, res) => {
  try {
    const { soilMoisture, temperature, humidity, batteryLevel } = req.body;

    // 1. Save History
    await SensorData.create({
      soilMoisture,
      temperature,
      humidity,
      batteryLevel,
    });

    // 2. Update Heartbeat
    let state = await DeviceState.findOne();
    if (!state)
      state = await DeviceState.create({ deviceId: 'roof-system-001' });

    state.lastHeartbeat = Date.now();

    if (batteryLevel < 20) {
      const io = req.app.get('socketio');
      if (io) {
        io.emit('system_alert', {
          type: 'CRITICAL', // Code for Red Color
          message: `⚠️ Low Battery Warning: System at ${batteryLevel}%. Please charge immediately.`,
        });
        console.log(`⚠️ Alert Sent: Low Battery (${batteryLevel}%)`);
      }
    }
   

    let pumpCommand = state.pumpStatus;

    if (state.automaticMode) {
      if (soilMoisture < state.moistureThreshold) {
        
        let isRaining = false;
        try {
          if (state.weatherCheckEnabled) {
            isRaining = await checkRainStatus();
          }
        } catch (err) {
          console.log('Weather check skipped:', err.message);
        }

        if (isRaining) {
          console.log('🌧️ Rain detected/forecast. Pump kept OFF.');
          pumpCommand = false;
        } else {
          pumpCommand = true;
        }
      } else {
        pumpCommand = false;
      }
    }


    if (pumpCommand !== state.pumpStatus) {
      state.pumpStatus = pumpCommand;

      
      const io = req.app.get('socketio');
      if (io) io.emit('pump_update', { pumpStatus: pumpCommand });
    }

    await state.save();

    
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_reading', {
        soilMoisture,
        temperature,
        humidity,
        batteryLevel,
        onlineStatus: 'Online',
      });
    }

    res.json({
      command: state.pumpStatus ? 'PUMP_ON' : 'PUMP_OFF',
      settings: {
        threshold: state.moistureThreshold,
      },
    });
  } catch (error) {
    console.error('Error in postSensorData:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getHistory = async (req, res) => {
  try {
    const history = await SensorData.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching history' });
  }
};
