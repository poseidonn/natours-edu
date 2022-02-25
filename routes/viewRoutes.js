const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingFromCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getloginForm);
router.get('/me', authController.protect, viewController.getAccountPage);
router.get('/my-tours', authController.protect, viewController.getMyTours);

//Form ile submit ettiğimizde kullandık
/* router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
); */

module.exports = router;
