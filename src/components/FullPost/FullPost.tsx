import React, { useState } from 'react';
import axios from 'axios';
import { Col, Button } from 'react-bootstrap';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Collapse,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { PostDataObj, NotificationType } from '../../types/post/data';

export interface FullPostProps {
  id: number | undefined;
  loadedPost: PostDataObj | undefined;
  loading: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  fullPost: {
    margin: theme.spacing(2),
    border: '1px solid #eee',
    boxShadow: '0 2px 3px #ccc',
    textAlign: 'center',
  },
  edit: {
    label: {
      display: 'block',
      color: 'grey',
    },
    button: {
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      outline: 'none',
      color: '#fa923f',
      '&:hover': {
        color: '#521751',
      },
      '&:active': {
        color: '#521751',
      },
    },
  },
  delete: {
    color: 'red',
    '&:hover': {
      color: 'darkred',
    },
    '&:active': {
      color: 'darkred',
    },
  },
}));
const FullPost = ({ id, loadedPost, loading }: FullPostProps): JSX.Element => {
  const url: string = 'https://jsonplaceholder.typicode.com/posts/'.concat(
    id ? id.toString() : ''
  );
  const styles = useStyles({});
  const [open, setOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.INFO
  );

  const handleClose = () => {
    setOpen(false);
  };

  const deleteConfirm = () => {
    setOpen(true);
  };

  const notification = (): JSX.Element => (
    <Collapse in={notificationOpen}>
      <Alert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setNotificationOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        severity={notificationType}
      >
        {notificationMsg}
      </Alert>
    </Collapse>
  );
  const deletePostHandler = async () => {
    // confirmation message before proceeding
    window.confirm('Are you sure you want to continue?');
    await axios.delete(url).then((response) => {
      // check status 200
      if (response.status === 200) {
        setNotificationOpen(true);
        setNotificationMsg('Article deleted!');
        setNotificationType(NotificationType.SUCCESS);
      } else {
        setNotificationOpen(true);
        setNotificationMsg('Something went wrong!');
        setNotificationType(NotificationType.ERROR);
      }
      // remove entry from array
    });
  };
  const fullPostHandler = (): JSX.Element => {
    if (loading) {
      return (
        <p data-test="loading-div" style={{ textAlign: 'center' }}>
          Loading...!
        </p>
      );
    }
    if (loadedPost && loadedPost.title) {
      return (
        <>
          {notification()}
          <Col className={styles.fullPost} data-test="loadedPost-div">
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle id="alert-dialog-title">
                Are you sure you want to continue?
              </DialogTitle>
              <DialogActions>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={deletePostHandler}>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <h6 data-test="loadedPost-title">{loadedPost.title}</h6>
            <p data-test="loadedPost-body">{loadedPost.body}</p>
            <div className={styles.edit}>
              <button
                type="button"
                onClick={deleteConfirm}
                className={styles.delete}
              >
                Delete
              </button>
            </div>
          </Col>
        </>
      );
    }
    return (
      <p data-test="noResult-div" style={{ textAlign: 'center' }}>
        Please select a Post!
      </p>
    );
  };
  return fullPostHandler();
};

export default FullPost;
