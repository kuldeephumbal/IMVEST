require('dotenv').config();
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const connectDB = require('./config/db');
const swaggerDocs = require('./docs/swagger');

// Middleware
swaggerDocs(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const requestContext = require('./middleware/requestContext');
app.use(requestContext);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// MongoDB Connection
connectDB();

// Routes
const adminRoutes = require('./routes/admin');
const auditRoutes = require('./routes/audit');
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
