import React from 'react';
import Container from 'react-bootstrap/Container';
import { Provider } from 'react-redux';
import Blog from './container/Blog';
import ThemeWrapper from './utils/ThemeWrapper';
import store from './store';

function App() {
  return (
    <ThemeWrapper>
      <Provider store={store}>
        <Container title="mainDiv">
          <Blog />
        </Container>
      </Provider>
    </ThemeWrapper>
  );
}

export default App;
