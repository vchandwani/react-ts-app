import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Button, Container } from 'react-bootstrap';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Post from '../components/Post/Post';
import FullPost from '../components/FullPost/FullPost';
// import NewPost from '../../components/NewPost/NewPost';
import { loadPost } from '../utils/loadPost';
import { PostDataObj } from '../types/post/data';

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

const Blog: React.FC = (): JSX.Element => {
  const [posts, setPosts] = useState<Array<PostDataObj>>([]);
  const [postsDisplay, setPostsDisplay] = useState<Array<PostDataObj>>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>(
    undefined
  );
  const [displayCount, setDisplayCount] = useState<number>(4);
  const [loadedPost, setLoadedPost] = useState<PostDataObj | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const styles = useStyles({});

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
    setDisplayCount(displayCount + 4);
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h2>Add Articles!</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p>Articles can be added with title and content</p>
        </Col>
      </Row>
      {postsDisplay && (
        <Row>
          {postsDisplay.map((post: PostDataObj) => (
            <Post
              key={post.id}
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
        <FullPost
          id={selectedPostId}
          loadedPost={loadedPost}
          loading={loading}
        />
      </Row>
      <Row>{/* <NewPost /> */}</Row>
    </Container>
  );
};
export default Blog;
