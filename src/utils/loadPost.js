import axios from 'axios';
import { URL } from '../types/article/data';

async function loadPost(id) {
  try {
    const response = await axios.get(`${URL}/${id}`);
    if (response.status === 200 && response.data) {
      // response - object, eg { status: 200, message: 'OK' }
      return response.data;
    }
    throw Error('Error');
  } catch (err) {
    throw Error('Error');
  }
}

export { loadPost };
