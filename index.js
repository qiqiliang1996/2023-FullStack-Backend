import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/post.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

import { verifyTokenMiddleware } from './middlewares/authorizationMiddleware.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { posts, users } from './data/mockData.js';

//proper way to set path when we configure directory later

// ====== CONFIGURATION ======

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
// ==== MIDDLEWARE - all  on the express.js official website (middleware)
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '/public/assets')));

// === FILE STORAGE - all  on the express.js official website (middleware)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/assets');
  },
  filename: function (req, file, cb) {
    console.log('11  file.originalname', file.originalname);
    if (fs.existsSync(path.join('/public/assets', file.originalname))) {
      console.log('file already exist!!');
    }
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route with UPLOAD file
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyTokenMiddleware, upload.single('picture'), createPost);

//ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`hi~ Listening on PORT ${PORT}..`);
    });

    //ONLY ADD ONCE, NO NEED AFTER FIRST TIME ADDED
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    console.log(error, 'can not connect to db..');
  });
