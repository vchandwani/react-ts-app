import axios from 'axios';

async function loadPost(id) {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
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
