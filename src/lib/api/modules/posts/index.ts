import axios from 'axios';
import { AUTHOR, PostDataObj } from '../../../../types/post/data';

export interface PostsAPI {
  loadPosts(apiResource: string): Promise<PostDataObj[]>;
  postPost(apiResource: string, val: PostDataObj): Promise<PostPostResult>;
  deletePost(apiResource: string): Promise<PostPostResult>;
  getPost(apiResource: string): Promise<PostDataObj | null>;
}

// Format of API results

export interface PostResponseData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostsAPIResponse {
  data: PostResponseData[];
}

interface PostPostAPIResponse {
  code?: string;
  message?: string;
}

export interface PostPostResult {
  success: boolean;
  message: string;
}

/**
 * Posts API
 */

const posts: PostsAPI = {
  /**
   * Load posts
   */
  loadPosts: async (apiResource: string): Promise<PostDataObj[]> => {
    const url = `${apiResource}`;
    const res = await axios.get(url);
    const results: PostDataObj[] = [];
    if (res.data) {
      res.data.forEach((element: PostResponseData) => {
        if (element) {
          results.push({ ...element, author: AUTHOR });
        }
      });
    }
    return results.filter((r) => r !== null);
  },
  /**
   * Post Post document
   * @param apiResource
   * @param val
   */
  postPost: async (
    apiResource: string,
    val: PostDataObj
  ): Promise<PostPostResult> => {
    const url = `${apiResource}`;
    const res = await axios.post<PostPostAPIResponse>(url, val);

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

  /**
   * Delete post
   * @param apiResource
   */
  deletePost: async (apiResource: string): Promise<PostPostResult> => {
    const url = `${apiResource}`;
    const res = await axios.delete<PostPostAPIResponse>(url, {
      headers: {
        'Content-Type': 'application/json; carset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (res && res?.status !== 200) {
      return {
        success: false,
        message: res?.data?.message || 'Unknown error',
      };
    }
    return {
      success: true,
      message: res?.data?.message || 'Success',
    };
  },
  /**
   * Load posts
   */
  getPost: async (apiResource: string): Promise<PostDataObj | null> => {
    const url = `${apiResource}`;
    const res: PostDataObj = await axios.get(url);
    let result: PostDataObj | null = null;
    if (res) {
      result = res;
    }
    return result;
  },
};

export default posts;
