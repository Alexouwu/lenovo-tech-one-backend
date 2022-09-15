//Main imports
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');

//Controllers
const petitionRoute = require('./routes/petition');

//Cron send Notifications
require('./cron/sendnotification.js')

//App settings
app.use(bodyParser.json());
app.use(cors());
app.set('port',process.env.PORT || 4000);

//Routes
app.get('/lenovo-event', (req,res) => {
    res.send('Lenovo Tech One API 2.0');
});
app.use('/lenovo-event/', petitionRoute)

//Server
const server = http.createServer(app);

//Test server
server.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'))
});