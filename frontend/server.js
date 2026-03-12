const express = require('express');
const path = require('path');
const app = express();

// Serve Angular production build
app.use(express.static(path.join(__dirname, 'dist/knowsphere')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/knowsphere/index.html'));
});

// Railway provides PORT automatically
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
