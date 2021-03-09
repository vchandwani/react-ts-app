import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Button } from 'react-bootstrap';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Post from '../Post/Post';
import { loadPost } from '../../utils/loadPost';
import { PostDataObj, URL, NotificationType } from '../../types/post/data';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import { loadPosts, clearResults } from '../../store/modules/posts';
import { RootState } from '../../store/reducers';

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
  const dispatch = useDispatch();
  const [postsDisplay, setPostsDisplay] = useState<Array<PostDataObj>>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>(
    undefined
  );
  const [clickCounter, setClickCounter] = useState<number>(1);
  const displayCount: number = 4;
  const [loadedPost, setLoadedPost] = useState<PostDataObj | undefined>(
    undefined
  );

  const { posts, error, isLoaded, isLoading } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(clearResults());
    dispatch(loadPosts(URL));
  }, [dispatch]);

  useEffect(() => {
    posts && setPostsDisplay(posts.slice(0, displayCount));
  }, [posts]);

  useEffect(() => {
    // on change of click counter re-arrange post display
    const additionalPosts = posts?.slice(
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
          const data = await loadPost(selectedPostId);
          if (data) {
            setLoadedPost(data);
          } else {
            setLoadedPost(undefined);
          }
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
      <BackDrop open={isLoading} data-testid="backDropDiv" />
      {error && (
        <Notification
          data-testid="notificationDiv"
          open={true}
          notificationType={NotificationType.ERROR}
          notificationMsg={error}
        />
      )}

      {isLoaded && postsDisplay && (
        <Row data-testid="postDataDiv">
          {postsDisplay.map((post: PostDataObj, index: number) => (
            <Post
              key={post?.userId?.toString().concat(index.toString())}
              title={post.title}
              author={post?.author ? post?.author : ''}
              body={post.body}
              id={post.id}
              userId={post.userId}
              clicked={() => postSelectedHandler(post.id)}
              deleteOperation={(id: number) => checkDelete(id)}
              data-testid="postMainDiv"
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
            data-testid="loadMoreButtonDiv"
          >
            Load More
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default DisplayPost;
