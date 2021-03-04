import axios from 'axios';
import { AUTHOR, PostDataObj } from '../../../../types/article/data';

export interface ArticlesAPI {
  loadArticles(apiResource: string): Promise<PostDataObj[]>;
  postArticle(
    apiResource: string,
    val: PostDataObj
  ): Promise<PostArticleResult>;
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

interface PostArticleAPIResponse {
  code?: string;
  message?: string;
}

interface PostArticleResult {
  success: boolean;
  message: string;
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
  /**
   * Post Article document
   * @param apiResource
   * @param val
   */
  postArticle: async (
    apiResource: string,
    val: PostDataObj
  ): Promise<PostArticleResult> => {
    const url = `${apiResource}`;
    const res = await axios.post<PostArticleAPIResponse>(url, val);

    if (res.status !== 201) {
      return {
        success: false,
        message: res.data.message || 'Unknown error',
      };
    }
    return {
      success: true,
      message: res.data.message || 'Success',
    };
  },
};

export default articles;
