import { loadPost } from './loadPost';
import { server, rest } from '../testServer';

test('Check loadPost api get call with correct data', async () => {
  const loadPostData = await loadPost(1);
  expect(loadPostData.data.userId).toEqual(2);
  expect(loadPostData.data.id).toEqual(2);
  expect(loadPostData.data.title).toEqual('Title');
  expect(loadPostData.data.body).toEqual('Body');
});

test('Check loadPost api get call with wrong data', async () => {
  server.use(
    rest.get(
      'https://jsonplaceholder.typicode.com/posts/2',
      (req, res, ctx) => {
        return res(ctx.status(404));
      },
    ),
  );
  await expect(loadPost()).rejects.toThrow('Error');
});
