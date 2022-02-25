const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Start express app
const app = express();

// Pug template tanımlama
app.set('view engine', 'pug');
// View klasörü ayarlama
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//// 1) Global Middleware

// Set security HTTP headers
//app.use(helmet());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limit request from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Çok fazla istek yollandı bu ipten',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50kb' }));

// Web sayfası için body parser
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAvarage',
      'ratingsQuantity',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);

// Test middleware
app.use((req, _res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

/// Routes

//app.get('/api/v1/tours', getAllTours);
//pp.post('/api/v1/tours', createTour);
//app.get('/api/v1/tours/:id/', getTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

app.use('/', viewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.all('*', (req, _res, next) => {
  // Yukarıda handle edilmeyen her route buna düşüyor. Yani 404 hatası
  /* res.status(404).json({
    status: 'Hata',
    message: `Aradığınız sayfa ${req.originalUrl} bulunamadı`,
  }); */

  // Yukarıda handle edilmeyen her route buna düşüyor
  /* const err = new Error(`Aradınız sayfa ${req.originalUrl} bulunamadı`);
  err.status = 'fail';
  err.statusCode = 404; */

  // Error class
  next(new AppError(`Bu server'da ${req.originalUrl} yok`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
