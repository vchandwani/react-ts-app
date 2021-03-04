import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Button } from 'react-bootstrap';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Post from '../Post/Post';
import FullPost from '../FullPost/FullPost';
import { loadPost } from '../../utils/loadPost';
import { PostDataObj, URL, NotificationType } from '../../types/article/data';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import { loadArticles, clearResults } from '../../store/modules/articles';
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

  const { articles, error, isLoaded, isLoading } = useSelector(
    (state: RootState) => state.articles
  );

  useEffect(() => {
    dispatch(clearResults());
    dispatch(loadArticles(URL));
  }, [dispatch]);

  useEffect(() => {
    setPostsDisplay(articles.slice(0, displayCount));
  }, [articles]);

  useEffect(() => {
    // on change of click counter re-arrange post display
    const additionalPosts = articles.slice(
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
      <BackDrop open={isLoading} />
      {error && (
        <Notification
          open={true}
          notificationType={NotificationType.ERROR}
          notificationMsg={error}
        />
      )}

      {isLoaded && postsDisplay && (
        <Row>
          {postsDisplay.map((post: PostDataObj, index: number) => (
            <Post
              key={post.userId.toString().concat(index.toString())}
              title={post.title}
              author={post?.author ? post?.author : ''}
              body={post.body}
              id={post.id}
              userId={post.userId}
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
            loading={isLoading}
            deleteOperation={(id: number) => checkDelete(id)}
          />
        </Col>
      </Row>
    </>
  );
};

export default DisplayPost;
