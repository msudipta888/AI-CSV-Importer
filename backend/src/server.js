const express = require('express');
const cors = require('cors');
require('dotenv').config();

const importRouter = require('./routes/import');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Support parsing of large datasets (up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register routes
app.use('/api', importRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`GrowEasy Backend server running on port ${PORT}`);
});
