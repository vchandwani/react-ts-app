import { string, object } from 'yup';

export const PostSchema = object().shape({
  // username: string().email('Invalid email address').required('Required'),
  title: string()
    .trim('Invalid')
    .required('Required')
    .min(5, 'Minimum 5 characters!'),
  body: string().required('Required'),
  author: string().required('Required'),
});
