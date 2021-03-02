import React, { useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Post from '../Post/Post';
import FullPost from '../FullPost/FullPost';
import { loadPost } from '../../utils/loadPost';
import { PostDataObj } from '../../types/post/data';

const useStyles = makeStyles((theme: Theme) => ({
  loadMoreDiv: {
    textAlign: 'center',
    margin: theme.spacing(2, 0),
  },
  loadMore: {
    background: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.light}`,
  },
}));

const DisplayPost: React.FC = (): JSX.Element => {
  const styles = useStyles({});

  const [posts, setPosts] = useState<Array<PostDataObj>>([]);
  const [postsDisplay, setPostsDisplay] = useState<Array<PostDataObj>>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>(
    undefined
  );
  const [clickCounter, setClickCounter] = useState<number>(1);
  const [displayCount, setDisplayCount] = useState<number>(4);
  const [loadedPost, setLoadedPost] = useState<PostDataObj | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      const postsResponse = response.data;
      const updatedPosts = postsResponse.map((post: PostDataObj) => ({
        ...post,
        author: 'Varun',
      }));
      setPosts(updatedPosts);
      // console.log( response );
    });
  }, []);

  useEffect(() => {
    setPostsDisplay(posts.slice(0, displayCount));
  }, [posts, displayCount]);

  useEffect(() => {
    // on change of click counter re-arrange post display
    const additionalPosts = posts.slice(
      (clickCounter - 1) * displayCount,
      clickCounter * displayCount
    );
    setPostsDisplay(postsDisplay.concat(additionalPosts));
  }, [clickCounter]);

  useEffect(() => {
    // Make call for selected data
    if (selectedPostId) {
      const loadData = async () => {
        if (!loadedPost || (loadedPost && loadedPost.id !== selectedPostId)) {
          setLoading(true);
          const data = await loadPost(selectedPostId);
          if (data) {
            setLoadedPost(data);
          } else {
            setLoadedPost(undefined);
          }
          setLoading(false);
        }
      };
      loadData();
    }
  }, [selectedPostId, loadedPost]);

  const postSelectedHandler = (id: number | undefined) => {
    setSelectedPostId(id);
  };

  const loadMore = () => {
    // incrememnt value
    setClickCounter(clickCounter + 1);
  };

  const checkDelete = (id: number) => {
    if (id) {
      // remove deleted id from display
      setPostsDisplay(postsDisplay.filter((i) => i.id !== id));
    }
  };
  return (
    <>
      {postsDisplay && (
        <Row>
          {postsDisplay.map((post: PostDataObj, index: number) => (
            <Post
              key={post.userId.toString().concat(index.toString())}
              title={post.title}
              author={post?.author ? post?.author : ''}
              content={post.body}
              clicked={() => postSelectedHandler(post.id)}
            />
          ))}
        </Row>
      )}
      <Row>
        <Col className={styles.loadMoreDiv}>
          <Button
            className={styles.loadMore}
            variant="primary"
            onClick={() => loadMore()}
          >
            Load More
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FullPost
            id={selectedPostId}
            loadedPost={loadedPost}
            loading={loading}
            deleteOperation={(id: number) => checkDelete(id)}
          />
        </Col>
      </Row>
    </>
  );
};

export default DisplayPost;
