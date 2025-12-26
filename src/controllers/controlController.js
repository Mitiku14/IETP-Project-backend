const DeviceState = require('../models/DeviceState');

// Helper: Ensure a DeviceState document exists (creates one if not found)
const getDeviceState = async () => {
  let state = await DeviceState.findOne();
  if (!state) {
    state = await DeviceState.create({ deviceId: 'roof-system-001' });
  }
  return state;
};

// @desc    Get System Status (Pump, Thresholds, Online/Offline)
// @route   GET /api/control/status
exports.getSystemStatus = async (req, res) => {
  try {
    const state = await getDeviceState();

    // 💓 HEARTBEAT LOGIC
    // If last message was more than 5 minutes (300000ms) ago -> OFFLINE
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

// @desc    Toggle Pump Manually (User Override)
// @route   POST /api/control/pump
exports.togglePump = async (req, res) => {
  try {
    const { status } = req.body; // true (ON) or false (OFF)
    const state = await getDeviceState();

    state.pumpStatus = status;
    state.automaticMode = false; // Manual override disables auto mode temporarily
    await state.save();

    // ⚡ Real-time Update: Tell App & Hardware the pump changed
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

// @desc    Update Settings (Thresholds, Auto Mode)
// @route   PUT /api/control/settings
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
