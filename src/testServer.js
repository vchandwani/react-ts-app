import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { URL } from './types/article/data';

const server = setupServer(
  rest.get(`${URL}/1`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        data: {
          userId: 2,
          id: 2,
          title: 'Title',
          body: 'Body',
        },
      })
    )
  ),
  rest.get('*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Please add request handler' })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };
