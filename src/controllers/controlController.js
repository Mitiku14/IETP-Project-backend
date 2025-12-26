const DeviceState = require('../models/DeviceState');

const getDeviceState = async () => {
  let state = await DeviceState.findOne();
  if (!state) {
    state = await DeviceState.create({ deviceId: 'roof-system-001' });
  }
  return state;
};

exports.getSystemStatus = async (req, res) => {
  try {
    const state = await getDeviceState();

  
    const now = new Date();
    const lastSeen = new Date(state.lastHeartbeat);
    const diffMs = now - lastSeen;
    const isOnline = diffMs < 5 * 60 * 1000; // 5 minutes

    res.json({
      ...state._doc,
      onlineStatus: isOnline ? 'Online' : 'Offline',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.togglePump = async (req, res) => {
  try {
    const { status } = req.body; // true (ON) or false (OFF)
    const state = await getDeviceState();

    state.pumpStatus = status;
    state.automaticMode = false; // Manual override disables auto mode temporarily
    await state.save();

    
    const io = req.app.get('socketio');
    io.emit('pump_update', { pumpStatus: status });

    res.json({
      message: `Pump turned ${status ? 'ON' : 'OFF'}`,
      pumpStatus: state.pumpStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error switching pump' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { moistureThreshold, automaticMode, weatherCheckEnabled } = req.body;
    const state = await getDeviceState();

    if (moistureThreshold !== undefined)
      state.moistureThreshold = moistureThreshold;
    if (automaticMode !== undefined) state.automaticMode = automaticMode;
    if (weatherCheckEnabled !== undefined)
      state.weatherCheckEnabled = weatherCheckEnabled;

    await state.save();

    res.json({ message: 'Settings Updated', settings: state });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};
