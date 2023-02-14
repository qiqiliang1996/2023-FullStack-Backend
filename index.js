const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('config');
const { fileURLToPath } = require('url');

const { register } = require('./controllers/auth');
const { createPost } = require('./controllers/post');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const {
  verifyTokenMiddleware,
} = require('./middlewares/authorizationMiddleware');

const { User } = require('./models/User');
const { Post } = require('./models/Post');

const { posts, users } = require('./data/mockData');

//

//proper way to set path when we configure directory later

// ====== CONFIGURATION ======
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();

console.log(`1 db is::: ${config.get('db')}`);
console.log('2 module', module);

const app = express();
// ==== MIDDLEWARE - all  on the express.js official website (middleware)
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
// app.use('/assets', express.static(path.join(__dirname, '/public/assets')));

// === FILE STORAGE - all  on the express.js official website (middleware)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    console.log('11  file.originalname', file.originalname);
    // if (fs.existsSync(path.join('/public/assets', file.originalname))) {
    //   console.log('file already exist!!');
    // }
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
  .connect(config.get('db'))
  .then(() => {
    console.log('connect db successfullt!');
    //ONLY ADD ONCE, NO NEED AFTER FIRST TIME ADDED
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    console.log(error, 'can not connect to db..');
  });

app.listen(PORT, () => {
  console.log(`hi~ Listening on PORT ${PORT}..`);
});
