import React, { useState, useMemo, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PostDataObj,
  NotificationType,
  URL,
  AUTHOR,
  USERID,
} from '../../types/post/data';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import { RootState } from '../../store/reducers';
import {
  postPost,
  clearActioned,
  clearResults,
} from '../../store/modules/post';
import PostForm from './PostForm';

const useStyles = makeStyles((theme) => ({
  postForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  newPost: {
    margin: theme.spacing(3),
    border: '1px solid #eee',
    boxShadow: '0 2px 3px #ccc',
    button: {
      '&:hover,&:active': {
        color: 'white',
        backgroundColor: '#fa923f',
      },
    },
  },
}));

const NewPost = (): JSX.Element => {
  const { post, isLoaded, isLoading, error, actioned, editable } = useSelector(
    (state: RootState) => state.post
  );

  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.INFO
  );
  const styles = useStyles();
  useEffect(() => {
    dispatch(clearActioned());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      setNotificationMsg(error);
      setNotificationType(NotificationType.ERROR);
      setNotificationOpen(true);
    }
  }, [error]);
  useEffect(() => {
    if (actioned) {
      setFormValues({ title: '', body: '', author: AUTHOR, userId: USERID });
      setNotificationMsg(editable ? `Post edited` : `Post added`);
      setNotificationType(NotificationType.SUCCESS);
      setNotificationOpen(true);
    } else {
      setNotificationOpen(false);
    }
  }, [actioned, editable]);

  const initial: PostDataObj = useMemo(
    () => ({
      userId: post?.userId || USERID,
      author: post?.author || AUTHOR,
      title: post?.title || '',
      body: post?.body || '',
      id: post?.id || undefined,
    }),
    [post]
  );

  const [formValues, setFormValues] = useState<PostDataObj>({
    userId: initial.userId,
    author: initial.author,
    title: initial.title,
    body: initial.body,
    id: initial.id,
  });

  const backClick = (): void => {
    dispatch(clearResults());
    history.push('/');
  };
  const submitClick = (values: PostDataObj): void => {
    setFormValues({ ...values });
    dispatch(postPost(URL, values));
  };
  return (
    <>
      <BackDrop open={isLoading} data-testid="backDropDiv" />
      <div data-testid="testDiv">
        {notificationOpen && notificationMsg && (
          <Notification
            data-testid="notificationDiv"
            open={notificationOpen}
            notificationType={notificationType}
            notificationMsg={notificationMsg}
          />
        )}
      </div>

      <Grid item xs={12} data-testid="postFormDiv">
        <Row className="mt-1 mb-1">
          <Col xs={12}>
            <Typography variant="h5" data-testid="postFormHeader">
              {editable ? 'Edit' : 'Add'} Post
            </Typography>
          </Col>
        </Row>
      </Grid>
      {isLoaded && (
        <Col
          className={(styles.newPost, styles.postForm)}
          data-testid="postFormContainer"
        >
          <PostForm
            formValues={formValues}
            onSubmit={submitClick}
            backClick={backClick}
            editable={editable}
          />
        </Col>
      )}
    </>
  );
};

export default NewPost;
