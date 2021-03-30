const express = require('express');
const app = express();
const mongoos = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')



dotenv.config();

//db

mongoos.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('DB Connected.'))

mongoos.connection.on('error', err => 
{
    console.log('DB connection error: %s', err.message);
})

//bringing routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');


const myOwnMiddleWare = (req, res, next) => {console.log("MiddleWare applied.");
    next();
};


//middleware

app.use(morgan("dev"));
app.use(myOwnMiddleWare);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", postRoutes);
app.use("/", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {console.log('A node JS API is listening on port: %s', port);


});

