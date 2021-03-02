import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import DisplayPost from '../components/DisplayPost/DisplayPost';
import NewPost from '../components/NewPost/NewPost';

const Blog: React.FC = (): JSX.Element => (
  <Container>
    <Router>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Link to="/">
            <Navbar.Brand>Article Portal</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                List
              </Nav.Link>
              <Nav.Link as={Link} to="/newArticle">
                Add Article
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Row>
          <Col xs={12}>
            <h2>Articles Portal!</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>Articles can be added, edited and deleted</p>
          </Col>
        </Row>
        <Route path="/" exact component={DisplayPost} />
        <Route path="/newArticle/:id" component={NewPost} />
      </div>
    </Router>
  </Container>
);
export default Blog;
