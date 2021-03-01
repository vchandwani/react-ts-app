import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/posts/1', (req, res, ctx) =>
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
