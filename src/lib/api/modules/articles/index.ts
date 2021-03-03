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
    const url = `/${apiResource}`;

    const res = await axios.get<ArticlesAPIResponse>(url);
    const results: PostDataObj[] = [];
    console.log('res.data');
    console.log(res.data);
    if (res.data) {
      console.log(res.data);
      // res.data.foreach((value: ArticleResponseData) => {
      //   const entry: ArticleResponseData | null = null;
      //   if (entry) {
      //     results.push({ ...entry, author: AUTHOR });
      //   }
      // });
    }
    return results.filter((r) => r !== null);
  },
};

export default articles;
