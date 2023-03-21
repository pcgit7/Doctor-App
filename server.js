const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const dbConfig = require('./config/dbConfig');
const path = require('path');
app.use(express.json());

const adminRoute = require('./Routes/adminRoutes');
const userRoute = require('./Routes/userRoutes');
const doctorsRoute = require('./Routes/doctorsRoutes');


app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor/',doctorsRoute);

if(process.env.NODE_ENV === 'production')
{
    app.use('/' . express.static('client/build'));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname , 'client/build/index.html'));
    });
}

app.listen(port , () => {
    console.log(`listning on port ${port}`);
});