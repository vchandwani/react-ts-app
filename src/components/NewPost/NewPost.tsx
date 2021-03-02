import React, { useState } from 'react';
import axios from 'axios';
import { Col } from 'react-bootstrap';
import {
  Typography,
  Grid,
  TextField,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import { Formik, Form, Field, FieldProps } from 'formik';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';
import { PostDataObj } from '../../types/post/data';
import { ArticleSchema } from '../../lib/validation/article';

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
    margin: theme.spacing(3, 0, 2),
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

const NewPost = ({}): JSX.Element => {
  const [postData, setPostData] = useState<PostDataObj>({
    title: '',
    body: '',
    userId: 1,
    author: 'Varun',
  });
  const styles = useStyles();

  const postDataHandler = () => {
    axios
      .post('https://jsonplaceholder.typicode.com/posts/', postData)
      .then((response) => {
        console.log(response);
      });
  };

  const getUsernameEndAdornment = (error: string | undefined): JSX.Element => {
    if (!error) {
      return <CheckCircleIcon className={styles.tickIcon} />;
    }
    if (error) {
      return <ErrorIcon className={styles.crossIcon} />;
    }
    return <></>;
  };

  return (
    <Col className={(styles.newPost, styles.articleForm)}>
      <Formik
        data-testid="articleForm-container"
        initialValues={postData}
        validationSchema={ArticleSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          console.log(values);
          // postDataHandler(values);
        }}
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
                      <MenuItem value="Varun">Varun</MenuItem>
                      <MenuItem value="Unknown">Unknown</MenuItem>
                    </Select>
                  )}
                </Field>
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
          </Form>
        )}
      </Formik>
    </Col>
  );
};

export default NewPost;
