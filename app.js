const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
// const morgan = require("morgan");
const errorHandler = require('./middleware/errorhandler');
const connectDB = require('./config/dbConnection');


connectDB();
const app = express();


const PORT = process.env.PORT || 5000;
 

// Create an instance of Express app

app.use(express.json()); //allows us to access request body as req.body


// app.use(morgan("dev"));  //enable incoming request logging in dev mode

// Middleware for parsing request bodies as JSON
app.use(bodyParser.json());



app.use('/api/contacts', require('./routes/contactRoutes'))

app.use('/api/users', require('./routes/userRoutes'))



app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});