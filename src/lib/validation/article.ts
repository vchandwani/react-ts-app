import { string, object } from 'yup';

export const ArticleSchema = object().shape({
  // username: string().email('Invalid email address').required('Required'),
  title: string().trim('Invalid').required('Required').min(5, 'Invalid'),
  body: string().required('Required'),
  author: string().required('Required'),
});
