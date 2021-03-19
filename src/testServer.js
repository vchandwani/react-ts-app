import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { URL } from './types/post/data';

const server = setupServer(
  rest.get(`${URL}`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            userId: 1,
            id: 1,
            title: 'Title',
            body: 'Body',
          },
          {
            userId: 2,
            id: 2,
            title: 'Title',
            body: 'Body',
          },
        ],
      })
    )
  ),
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
  rest.post(`${URL}`, (req, res, ctx) =>
    res(
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'message',
        data: {
          userId: 1,
          title: 'Title',
          body: 'Body',
          author: 'Varun',
        },
      })
    )
  ),

  rest.get('http://localhost/*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'You must add request handler.' })
    );
  }),
  rest.post('http://localhost/*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    res(
      ctx.status(500),
      ctx.json({
        success: false,
        message: 'error',
        error: 'Please add request handler',
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };
