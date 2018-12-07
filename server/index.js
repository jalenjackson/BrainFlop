require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const routes = require('../routes');
const quizRoutes = require('./api/routes/quizzes');
const questionRoutes = require('./api/routes/questions');
const userRoutes = require('./api/routes/user');
const tagRoutes = require('./api/routes/tags');
const timeRoutes = require('./api/routes/time');
const searchRoutes = require('./api/routes/search');
const PORT = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

app
  .prepare()
  .then(() => {
    const server = express();

    // Connect to MongoDB Database
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
    });

    // Set up middleware for CORS and allowing JSON in requests
    server.use(logger('dev'));
    server.use('/uploads', express.static('uploads'));
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use((req, res, next) => {
      var allowedOrigins = ['http://localhost:3000', 'https://www.brainflop.com', 'https://localhost:3000', 'http://127.0.0.1:8081', 'http://localhost:8081'];
      var origin = req.headers.origin;
      if (allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
      }
      next();
    });

    // Instantiate routes we will use
    server.use('/api/quizzes', quizRoutes);
    server.use('/api/questions', questionRoutes);
    server.use('/api/users', userRoutes);
    server.use('/api/tags', tagRoutes);
    server.use('/api/time', timeRoutes);
    server.use('/api/search', searchRoutes);

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> BrainFlop Ready On Port ${PORT}`)
    });
});
