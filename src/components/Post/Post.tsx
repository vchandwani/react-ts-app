import React, { useState } from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

interface PostProps {
  title: string;
  author: string;
  content: string;
  clicked(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  postDiv: {
    border: '1px solid #eee',
    boxShadow: '0 2px 3px #ccc',
    color: '#808080',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#cecece',
    },
    '&:active': {
      backgroundColor: '#cecece',
    },
  },
  height100: {
    height: '100%',
  },
  author: {
    margin: theme.spacing(2, 0),
    color: '#ccc',
  },
  readMore: {
    position: 'absolute',
    left: '5px',
    bottom: '5px',
  },
  info: {
    margin: '1rem 0px',
  },
}));

const Post = ({ title, author, content, clicked }: PostProps): JSX.Element => {
  const [characterLength, setCharacterLength] = useState(20);
  const [fullRead, setFullRead] = useState(false);
  const styles = useStyles({});

  const readMore = () => {
    setCharacterLength(255);
    setFullRead(true);
  };

  return (
    <Col xs={12} sm={4} className="mt-1 mb-1" data-test="post-div">
      <Card
        className={[styles.postDiv, fullRead && styles.height100].join(' ')}
      >
        <Card.Body onClick={clicked}>
          <Card.Title data-test="post-title">
            {title.length > characterLength
              ? title.substring(0, characterLength)
              : title}
          </Card.Title>
          <Card.Text data-test="post-content">
            {content.length > characterLength
              ? content.substring(0, characterLength)
              : content}
          </Card.Text>
          {author && <Card.Text>{author}</Card.Text>}
        </Card.Body>
        <Card.Body>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Button
              data-test="post-button"
              className="ReadMore"
              variant="primary"
              onClick={readMore}
            >
              Read more
            </Button>
            <EditIcon />
          </Grid>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Post;
