require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── CORS ───────────────────────────────────────────────────────────────── */
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
      /^https:\/\/.*\.up\.railway\.app$/
    ];
    if (!origin || allowed.some(r => r.test(origin))) {
      cb(null, true);
    } else {
      cb(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* ── Connect MongoDB first, THEN load routes and start server ───────────── */
mongoose.connection.on('error', err =>
  console.error('❌  Mongoose error:', err.message)
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');

    /* Routes are required HERE — after connection is live.
       This guarantees mongoose.model() has a real connection
       so Topic.findOne / Topic.create work correctly. */
    app.use('/api/topics', require('./routes/topics'));
    app.use('/api/search', require('./routes/search'));
    app.use('/api/ai',     require('./routes/ai'));

    app.get('/api/health', (_req, res) =>
      res.json({ status: 'ok', db: 'connected' })
    );

    app.use((err, _req, res, _next) => {
      console.error(err);
      res.status(500).json({ error: err.message || 'Server Error' });
    });

    app.listen(PORT, () => console.log(`🚀  API → http://localhost:${PORT}`));
  })
  .catch(err => {
    /* Log but do NOT call process.exit — lets nodemon keep watching */
    console.error('❌  MongoDB connect failed:', err.message);
    console.error('    Make sure MongoDB is running: mongod --dbpath <path>');
  });
