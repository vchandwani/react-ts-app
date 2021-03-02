import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import {
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import {
  PostDataObj,
  NotificationType,
  Values,
  URL,
} from '../../types/post/data';
import { ArticleSchema } from '../../lib/validation/article';
import BackDrop from '../BackDrop/BackDrop';

const useStyles = makeStyles((theme) => ({
  articleForm: {
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

const NewPost = (preFilledData?: PostDataObj): JSX.Element => {
  const initialValues: PostDataObj = {
    userId: 1,
    author: 'Varun',
    title: '',
    body: '',
  };
  const [postData, setPostData] = useState<PostDataObj>({
    title: preFilledData?.title ? preFilledData.title : initialValues.title,
    body: preFilledData?.body ? preFilledData.body : initialValues.body,
    userId: preFilledData?.userId ? preFilledData.userId : initialValues.userId,
    author: preFilledData?.author ? preFilledData.author : initialValues.author,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const history = useHistory();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.INFO
  );
  const styles = useStyles();

  const refreshData = () => {
    setPostData({ title: '', body: '', author: 'Varun', userId: 1 });
  };

  useEffect(() => {
    if (notificationType === NotificationType.SUCCESS) {
      // action success
      setPostData(initialValues);
    }
  }, [notificationType]);

  const getUsernameEndAdornment = (error: string | undefined): JSX.Element => {
    if (!error) {
      return <CheckCircleIcon className={styles.tickIcon} />;
    }
    if (error) {
      return <ErrorIcon className={styles.crossIcon} />;
    }
    return <></>;
  };

  const backClick = (): void => {
    history.push('/');
  };

  const notification = (): JSX.Element => (
    <Row className="mt-1 mb-2">
      <Col xs={12}>
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
      </Col>
    </Row>
  );

  return (
    <>
      <BackDrop open={loading} />
      {notificationOpen && notification()}
      <Col className={(styles.newPost, styles.articleForm)}>
        <Formik
          data-testid="articleForm-container"
          initialValues={postData}
          validationSchema={ArticleSchema}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            setLoading(true);
            axios
              .post(URL, values)
              .then((response) => {
                try {
                  if (response.status === 201) {
                    setNotificationOpen(true);
                    setNotificationMsg('Article added!');
                    setNotificationType(NotificationType.SUCCESS);
                    refreshData();
                    setLoading(false);
                    actions.resetForm();
                  } else if (response.status !== 201) {
                    setNotificationOpen(true);
                    setNotificationMsg('Something went wrong!');
                    setNotificationType(NotificationType.ERROR);
                    setLoading(false);
                  }
                } catch (e) {
                  setNotificationOpen(true);
                  setNotificationMsg('Something went wrong!');
                  setNotificationType(NotificationType.ERROR);
                  setLoading(false);
                }
              })
              .catch((err) => {
                setNotificationOpen(true);
                setNotificationMsg('Something went wrong!');
                setNotificationType(NotificationType.ERROR);
                setLoading(false);
              });
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
                      console.log(field.value),
                      (
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
                      )
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
                        <MenuItem value="Varun">Varun</MenuItem>
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
                      Add Post
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Col>
    </>
  );
};

export default NewPost;
