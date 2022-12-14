/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const debug = require('debug')('todo-api:app');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const routes = require('./routes');
const pjson = require('./package.json');
const Constant = require('./utilities/constant');
//const fileUpload = require('express-fileupload');
const multer=require('multer')
const bodyParser = require('body-parser'); 
const swaggerDoc = require('./config/swaggerdoc');
const app = express();
swaggerDoc(app);

require('express-async-errors');

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.static("uploads"));

 //app.use(express.static(__dirname + '/public'));
// app.use('/api/v1/profile', express.static('uploads'));


//app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
// App security header
app.use(helmet());

const sixtyDaysInSeconds = 5184000;
app.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds,
  })
);

app.use(
  helmet.referrerPolicy({
    policy: 'origin',
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP parameter Pollution attacks
app.use(hpp());

// Allow cors
var corsOption = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOption));

// show version on home route
app.get('/', (req, res) => {
  res.json({ version: pjson.version });
});
app.use('/api/v1', routes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  debug(`error: ${err} ${err.statusCode}`);
  let errorResponse;
  if (err.name) {
    const code = err?.statusCode ? err.statusCode : 500;
    if (err.statusCode) {
      errorResponse = {
        status: false,
        error: err?.message,
        code,
      };
    } else {
      errorResponse = {
        status: false,
        error: Constant.labelList.invalidInput,
        code,
      };
    }
  }
  if (errorResponse) {
    res.status(errorResponse.code).json(errorResponse);
  } else {
    next();
  }
});
module.exports = app;
