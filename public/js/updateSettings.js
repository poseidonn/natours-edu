/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

//type =password or data

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        type === 'password'
          ? 'Şifre güncelleme başarılı'
          : 'Veri güncelleme başarılı'
      );
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
