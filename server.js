require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server }   = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const app = express();
const server = http.createServer(app);
connectDB();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]

    }
});
app.set('socketio', io);
io.on('connection', (socket) => {
    console.log(`New client connected', { socket.id }`);
    socket.on('disconnect', () => {
        console.log('Client Disconneced');
    });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/control', require('./src/routes/controlRoutes'));
app.use('/api/data', require('./src/routes/dataRoutes'));
app.get('/', (req, res) => {
  res.send('Roof Farming IOT Server is Running....');
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});