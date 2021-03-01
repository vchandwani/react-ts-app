import React from 'react';
import Container from 'react-bootstrap/Container';
import Blog from './container/Blog';
import ThemeWrapper from './utils/ThemeWrapper';

function App() {
  return (
    <ThemeWrapper>
      <Container title="mainDiv">
        <Blog />
      </Container>
    </ThemeWrapper>
  );
}

export default App;
