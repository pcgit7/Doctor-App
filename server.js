const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const dbConfig = require('./config/dbConfig');
const path = require('path');
app.use(express.json());
app.use(cors());
const adminRoute = require('./Routes/adminRoutes');
const userRoute = require('./Routes/userRoutes');
const doctorsRoute = require('./Routes/doctorsRoutes');

app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor/',doctorsRoute);

app.listen(port , () => {
    console.log(`listning on port ${port}`);
});