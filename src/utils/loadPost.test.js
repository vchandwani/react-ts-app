import { loadPost } from './loadPost';
import { server, rest } from '../testServer';
import { URL } from '../types/post/data';

test('Check loadPost api get call with correct data', async () => {
  const loadPostData = await loadPost(1);
  expect(loadPostData.data.userId).toEqual(2);
  expect(loadPostData.data.id).toEqual(2);
  expect(loadPostData.data.title).toEqual('Title');
  expect(loadPostData.data.body).toEqual('Body');
});

// test('Check loadPost api get call with wrong data', async () => {
//   server.use(rest.get(`${URL}/2`, (req, res, ctx) => res(ctx.status(404))));
//   await expect(loadPost()).rejects.toThrow('Error');
// });
