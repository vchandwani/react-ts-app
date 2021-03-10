import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import DisplayPost from '../components/DisplayPost/DisplayPost';
import NewPost from '../components/NewPost/NewPost';

const Blog: React.FC = (): JSX.Element => (
  <Container data-testid="portalContainer">
    <Router>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Link to="/">
            <Navbar.Brand data-testid="portalHeader">Post Portal</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" data-testid="navigationLink">
              <Nav.Link as={Link} to="/" data-testid="listPostLink">
                List
              </Nav.Link>
              <Nav.Link as={Link} to="/newPost" data-testid="addPostLink">
                Add Post
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Row>
          <Col xs={12} data-testid="portalSubHeader">
            <h2>Posts Portal!</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} data-testid="portalDescription">
            <p>Posts can be added, edited and deleted</p>
          </Col>
        </Row>
        <Switch>
          <Route path="/newPost/" exact component={NewPost} />
          <Route path="/" component={DisplayPost} />
        </Switch>
      </div>
    </Router>
  </Container>
);
export default Blog;
