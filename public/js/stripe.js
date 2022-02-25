/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51KWhXLEJ7rY53jT9sV2BKbu214NwE79BPmBG3AC8DUt4aKKzNeyjeHclS7yUllyrJXPSwbfbJrwgemYfjIhAXjwS00xEO28fzl'
);

export const bookTour = async (tourID) => {
  try {
    const response = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout/${tourID}`
    );

    await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  } catch (e) {
    showAlert('error', e);
  }
};
