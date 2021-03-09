import React, { useState, useMemo, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core';
import { Formik, Form, Field, FieldProps } from 'formik';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
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
import { PostSchema } from '../../lib/validation/post';
import BackDrop from '../BackDrop/BackDrop';
import Notification from '../Notification/Notification';
import { RootState } from '../../store/reducers';
import { postPost, clearActioned } from '../../store/modules/post';

const useStyles = makeStyles((theme) => ({
  postForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 1),
  },
  tickIcon: {
    color: theme.palette.primary.main,
  },
  crossIcon: {
    color: theme.palette.error.main,
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
  const { post, isLoaded, isLoading, error, actioned } = useSelector(
    (state: RootState) => state.post
  );

  const editable: boolean = !!post?.id;

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
      setNotificationMsg(`${editable}` ? `Post edited` : `Post added`);
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

  const getUsernameEndAdornment = (
    errorMsg: string | undefined
  ): JSX.Element => {
    if (!errorMsg) {
      return <CheckCircleIcon className={styles.tickIcon} />;
    }
    if (errorMsg) {
      return <ErrorIcon className={styles.crossIcon} />;
    }
    return <></>;
  };

  const backClick = (): void => {
    history.push('/');
  };
  return (
    <>
      <BackDrop open={isLoading} />
      {notificationOpen && notificationMsg && (
        <Notification
          open={notificationOpen}
          notificationType={notificationType}
          notificationMsg={notificationMsg}
        />
      )}
      <Grid item xs={12}>
        <Row className="mt-1 mb-1">
          <Col xs={12}>
            <Typography variant="h5">
              {editable ? 'Edit' : 'Add'} Post
            </Typography>
          </Col>
        </Row>
      </Grid>
      {isLoaded && (
        <Col className={(styles.newPost, styles.postForm)}>
          <Formik
            data-testid="postForm-container"
            initialValues={formValues}
            validationSchema={PostSchema}
            onSubmit={(values, actions) => {
              setFormValues({ ...values });
              actions.setSubmitting(false);
              dispatch(postPost(URL, values));
            }}
            // {/* enableReinitialize={true} */}
          >
            {({ errors, handleBlur, handleChange, touched }) => (
              <Form className={styles.form}>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Field name="title" type="text">
                      {({ field, form, meta }: FieldProps) => (
                        <TextField
                          data-testid="form-title-field"
                          {...field}
                          variant="filled"
                          fullWidth
                          autoFocus={true}
                          id="title"
                          label="Title"
                          autoComplete="title"
                          error={meta.touched && meta.error !== undefined}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {getUsernameEndAdornment(errors.title)}
                              </InputAdornment>
                            ),
                          }}
                          helperText={
                            errors.title && touched.title ? errors.title : null
                          }
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="body" type="text">
                      {({ field, form, meta }: FieldProps) => (
                        <TextField
                          multiline
                          rowsMax={4}
                          data-testid="form-body-field"
                          {...field}
                          variant="filled"
                          fullWidth
                          id="body"
                          autoComplete="body"
                          label="Content"
                          error={meta.touched && meta.error !== undefined}
                          helperText={
                            errors.body && touched.body ? errors.body : null
                          }
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="author" type="text" label="Author">
                      {({ field, form, meta }: FieldProps) => (
                        <Select
                          {...field}
                          data-testid="form-author-field"
                          id="author"
                          variant="filled"
                          fullWidth
                          error={meta.touched && meta.error !== undefined}
                        >
                          <MenuItem value={AUTHOR}>{AUTHOR}</MenuItem>
                          <MenuItem value="Unknown">Unknown</MenuItem>
                        </Select>
                      )}
                    </Field>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    item
                    xs={12}
                    justify="flex-end"
                    spacing={1}
                  >
                    <Grid item xs={12} sm={3}>
                      <Button
                        data-testid="loginForm-back"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className={styles.submit}
                        onClick={backClick}
                      >
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        data-testid="loginForm-submit"
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={styles.submit}
                      >
                        {`${editable ? `Edit` : `Add`} Post`}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Col>
      )}
    </>
  );
};

export default NewPost;
