import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Card, Nav } from 'react-bootstrap';
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { PostDataObj, URL, NotificationType } from '../../types/post/data';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import {
  loadPost,
  clearResults,
  deletePost,
  actionedClear,
} from '../../store/modules/post';
import { RootState } from '../../store/reducers';

export interface PostProps extends PostDataObj {
  clicked(): void;
  deleteOperation(id: number | undefined): void;
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  postDiv: {
    border: '1px solid #eee',
    boxShadow: '0 2px 3px #ccc',
    color: '#808080',
    width: '100%',
    boxSizing: 'border-box',
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
  delete: {
    cursor: 'pointer',
  },
}));

const Post = ({
  title,
  author,
  body,
  clicked,
  id,
  userId,
  deleteOperation,
}: PostProps): JSX.Element => {
  const [characterLength, setCharacterLength] = useState(20);
  const [fullRead, setFullRead] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const styles = useStyles({});
  const history = useHistory();
  const dispatch = useDispatch();
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.INFO
  );
  const theme = useTheme();

  const { isLoaded, isLoading, actioned, error } = useSelector(
    (state: RootState) => state.post
  );

  const readMore = () => {
    setCharacterLength(255);
    setFullRead(true);
  };

  const checkEdit = () => {
    // check valid id
    dispatch(clearResults());
    dispatch(loadPost({ title, author, body, id, userId }));
    isLoaded && !isLoading && history.push('/newPost');
  };

  const deleteConfirm = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(actionedClear());
  };
  const deletePostHandler = async () => {
    id && dispatch(deletePost(URL, id));
  };

  useEffect(() => {
    if (actioned) {
      setNotificationMsg(`Post deleted`);
      setNotificationType(NotificationType.SUCCESS);
      setNotificationOpen(true);
      deleteOperation(id);
    } else {
      setNotificationOpen(false);
    }
  }, [actioned]);
  useEffect(() => {
    if (error) {
      setNotificationMsg(error);
      setNotificationType(NotificationType.ERROR);
      setNotificationOpen(true);
    }
  }, [error]);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperComponent={PaperComponent}
        data-testid="postDialogDiv"
      >
        <BackDrop open={isLoading} data-testid="backDropDiv" />
        <DialogContent>
          {notificationOpen && notificationMsg && (
            <Notification
              open={notificationOpen}
              notificationType={notificationType}
              notificationMsg={notificationMsg}
              data-testid="notificationDiv"
            />
          )}
        </DialogContent>
        {!actioned && (
          <>
            <DialogTitle id="alert-dialog-title" data-testid="dialogHeader">
              Are you sure you want to continue?
            </DialogTitle>
            <DialogContent data-testid="dialogTitleText">
              <Typography component="h6" variant="h6">
                Title
              </Typography>
            </DialogContent>
            <DialogContent data-testid="dialogTitle">{title}</DialogContent>
            <DialogContent data-testid="contentTitleText">
              <Typography component="h6" variant="h6">
                Content
              </Typography>
            </DialogContent>
            <DialogContent data-testid="dialogBody">{body}</DialogContent>
          </>
        )}
        <DialogActions data-testid="dialogAction">
          <Button
            data-testid="dialogCloseButton"
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            {actioned ? 'Close' : 'Cancel'}
          </Button>
          {!actioned && (
            <Button
              variant="contained"
              color="primary"
              onClick={deletePostHandler}
              data-testid="dialogDeleteButton"
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Col
        xs={12}
        sm={6}
        md={4}
        className="mt-1 mb-1"
        data-testid="postCardDiv"
      >
        <Card
          className={[styles.postDiv, fullRead && styles.height100].join(' ')}
        >
          <Card.Body data-testid="postCard" onClick={clicked}>
            <Card.Title data-testid="postTitle">
              {title?.length > characterLength
                ? title.substring(0, characterLength)
                : title}
            </Card.Title>
            <Card.Text data-testid="postContent">
              {body?.length > characterLength
                ? body.substring(0, characterLength)
                : body}
            </Card.Text>
            {author && <Card.Text data-testid="postAuthor">{author}</Card.Text>}
          </Card.Body>
          <Card.Body>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} md={6}>
                <Button
                  data-testid="readMoreButton"
                  className="ReadMore"
                  variant="contained"
                  size="medium"
                  color="primary"
                  onClick={readMore}
                  fullWidth
                >
                  Read more
                </Button>
              </Grid>
              {id && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid>
                    <Nav.Link
                      onClick={() => checkEdit()}
                      data-testid="editLink"
                    >
                      <EditIcon />
                    </Nav.Link>
                  </Grid>
                  <Grid>
                    <DeleteIcon
                      className={styles.delete}
                      onClick={() => deleteConfirm()}
                      data-testid="deleteLink"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Post;
