require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
// Swagger Imports
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const connectDB = require('./src/config/db');

const app = express();
const server = http.createServer(app);


connectDB();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Roof Farming IoT API',
      version: '1.0.0',
      description:
        'API Documentation for IETP Roof Farming Project. \n\n**Base URL:** https://ietp-project-backend.onrender.com',
      contact: {
        name: 'Backend Support',
      },
    },
    servers: [
      {
        url: 'https://ietp-project-backend.onrender.com',
        description: '🚀 Live Render Server',
      },
      {
        url: 'http://localhost:5000',
        description: '💻 Local Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
 
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('📄 Swagger Docs available at /api-docs');
// ---------------------------------------------------------


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('socketio', io);

io.on('connection', (socket) => {
  
  console.log(`⚡ New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });
});


app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/control', require('./src/routes/controlRoutes'));
app.use('/api/data', require('./src/routes/dataRoutes'));


app.get('/', (req, res) => {
  res.send(
    '🌿 Roof Farming IoT Server is Running... Visit /api-docs for documentation.'
  );
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` Server UPDATED and running at http://localhost:${PORT}`);
});

