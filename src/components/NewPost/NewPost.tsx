import React, { useState } from 'react';
import axios from 'axios';
import { Col, Button, Form } from 'react-bootstrap';
import { PostDataObj } from '../../types/post/data';

const NewPost = ({}): JSX.Element => {
  const [postData, setPostData] = useState<PostDataObj>({
    title: '',
    body: '',
    userId: 1,
    author: 'Varun',
  });
  const postDataHandler = () => {
    axios
      .post('https://jsonplaceholder.typicode.com/posts/', postData)
      .then((response) => {
        console.log(response);
      });
  };
  return (
    <Col className="NewPost">
      <Form>
        <Form.Row>
          <Col xs={12}>Add a Post</Col>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={postData.title}
              onChange={(event) =>
                setPostData({ ...postData, title: event.target.value })
              }
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={postData.body}
              onChange={(event) =>
                setPostData({ ...postData, body: event.target.value })
              }
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Author</Form.Label>
            <Form.Control
              as="select"
              value={postData.author}
              onChange={(event) =>
                setPostData({ ...postData, author: event.target.value })
              }
            >
              <option value="Varun">Varun</option>
              <option value="Manu">Manu</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Col xs={12}>
            <Button onClick={() => postDataHandler()}>Add Post</Button>
          </Col>
        </Form.Row>
      </Form>
    </Col>
  );
};

export default NewPost;
