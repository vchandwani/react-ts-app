import axios from 'axios';
import { AUTHOR, PostDataObj } from '../../../../types/article/data';

export interface ArticlesAPI {
  loadArticles(apiResource: string): Promise<PostDataObj[]>;
}

// Format of API results

export interface ArticleResponseData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ArticlesAPIResponse {
  data: ArticleResponseData[];
}

/**
 * Documents API
 */

const articles: ArticlesAPI = {
  /**
   * Load documents by type
   */
  loadArticles: async (apiResource: string): Promise<PostDataObj[]> => {
    const url = `${apiResource}`;
    const res = await axios.get(url);
    const results: PostDataObj[] = [];
    if (res.data) {
      res.data.forEach((element: ArticleResponseData) => {
        if (element) {
          results.push({ ...element, author: AUTHOR });
        }
      });
    }
    return results.filter((r) => r !== null);
  },
};

export default articles;
