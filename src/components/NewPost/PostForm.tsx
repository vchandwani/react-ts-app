import React from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  Select,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import { PostDataObj, AUTHOR, Values } from '../../types/post/data';
import { PostSchema } from '../../lib/validation/post';

interface FormProps {
  formValues: PostDataObj;
  handleSubmit(values: PostDataObj): void;
  backClick(): void;
  editable: boolean;
}

const useStyles = makeStyles((theme) => ({
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
}));
const PostForm = (props: FormProps): JSX.Element => {
  const { formValues, handleSubmit, backClick, editable } = props;
  const styles = useStyles();

  const getUsernameEndAdornment = (
    errorMsg: string | undefined
  ): JSX.Element => {
    if (!errorMsg) {
      return (
        <CheckCircleIcon
          data-testid="successIcon"
          className={styles.tickIcon}
        />
      );
    }
    return <ErrorIcon data-testid="errorIcon" className={styles.crossIcon} />;
  };

  const onSubmit = async (values: PostDataObj) => {
    handleSubmit(values);
  };

  return (
    <Formik
      initialValues={formValues}
      enableReinitialize
      validationSchema={PostSchema}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        onSubmit(values);
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
                    {...field}
                    value={meta.value}
                    variant="filled"
                    data-testid="postFormTitleDiv"
                    fullWidth
                    autoFocus={true}
                    id="title"
                    label="Title"
                    autoComplete="title"
                    error={meta.touched && meta.error !== undefined}
                    inputProps={{
                      'data-testid': 'postFormTitleField',
                    }}
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
                    inputProps={{
                      'data-testid': 'postFormBodyField',
                    }}
                  />
                )}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <Field name="author" type="text" label="Author">
                {({ field, form, meta }: FieldProps) => (
                  <Select
                    {...field}
                    data-testid=""
                    id="author"
                    variant="filled"
                    fullWidth
                    error={meta.touched && meta.error !== undefined}
                    inputProps={{
                      'data-testid': 'postFormAuthorField',
                    }}
                  >
                    <option value={AUTHOR}>{AUTHOR}</option>
                    <option value="Unknown">Unknown</option>
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
                  data-testid="postFormBackButton"
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
                  data-testid="postFormSubmitButton"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={styles.submit}
                  disabled={editable && !formValues?.id}
                >
                  {`${editable ? `Edit` : `Add`} Post`}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
