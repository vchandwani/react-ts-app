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

import { PostDataObj, URL, NotificationType } from '../../types/article/data';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import {
  loadArticle,
  clearResults,
  deleteArticle,
  actionedClear,
} from '../../store/modules/article';
import { RootState } from '../../store/reducers';

interface PostProps extends PostDataObj {
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
    (state: RootState) => state.article
  );

  const readMore = () => {
    setCharacterLength(255);
    setFullRead(true);
  };

  const checkEdit = (postId: number) => {
    // check valid id
    dispatch(clearResults());
    dispatch(loadArticle({ title, author, body, id, userId }));
    isLoaded && !isLoading && history.push('/newArticle');
  };

  const deleteConfirm = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(actionedClear());
  };
  const deletePostHandler = async () => {
    id && dispatch(deleteArticle(URL, id));
  };

  useEffect(() => {
    if (actioned) {
      setNotificationMsg(`Article delete`);
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
      >
        <BackDrop open={isLoading} />
        <DialogContent>
          {notificationOpen && notificationMsg && (
            <Notification
              open={notificationOpen}
              notificationType={notificationType}
              notificationMsg={notificationMsg}
            />
          )}
        </DialogContent>
        {!actioned && (
          <>
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to continue?
            </DialogTitle>
            <DialogContent>
              <Typography component="h6" variant="h6">
                Title
              </Typography>
            </DialogContent>
            <DialogContent>{title}</DialogContent>
            <DialogContent>
              <Typography component="h6" variant="h6">
                Content
              </Typography>
            </DialogContent>
            <DialogContent>{body}</DialogContent>
          </>
        )}
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            {actioned ? 'Close' : 'Cancel'}
          </Button>
          {!actioned && (
            <Button
              variant="contained"
              color="primary"
              onClick={deletePostHandler}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Col xs={12} sm={6} md={4} className="mt-1 mb-1" data-test="post-div">
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
              {body.length > characterLength
                ? body.substring(0, characterLength)
                : body}
            </Card.Text>
            {author && <Card.Text>{author}</Card.Text>}
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
                  data-test="post-button"
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
                    <Nav.Link onClick={() => checkEdit(id)}>
                      <EditIcon />
                    </Nav.Link>
                  </Grid>
                  <Grid>
                    <DeleteIcon
                      className={styles.delete}
                      onClick={() => deleteConfirm()}
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
