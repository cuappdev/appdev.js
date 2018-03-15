// @flow

import AppDevUtilities from './AppDevUtilities';
import { Router, Request, Response, NextFunction } from 'express';

/**
 * RequestType - the HTTP methods supported by AppDevRouter
 */
export type RequestType = 'GET' | 'POST' | 'DELETE';

/**
 * AppDevResponse - the response from an HTTP request
 * 
 * Wraps a `success` field around the response data
 */
class AppDevResponse {
  success: boolean;
  data: Object;

  constructor (success: boolean, data: Object) {
    this.success = success;
    this.data = data;
  }
}

/**
 * AppDevRouter - cleanly create an Express Router object using inheritance
 *
 * Subclasses can simply specify the HTTP method, the path, and a response 
 * hook to compute response data. This pattern is cleaner than raw Express 
 * Router initialization with callbacks.
 */
class AppDevRouter {
  router: Router;
  requestType: RequestType;

  /**
   * Subclasses must call this constructor and pass in the HTTP method
   */
  constructor(type: RequestType) {
    this.router = new Router();
    this.requestType = type;

    // Initialize this router
    this.init();
  }
  
  /**
   * Subclasses must override this with the endpoint's URL. Paths must have 
   * the format "/<path>/". The starting and ending slashes are mandatory.
   */
  getPath(): string {
    throw new Error('You must implement getPath() with a valid path!');
  }

  /**
   * Initialize the Express Router using the specified path and response hook
   * implementation.
   */
  init() {
    const path = this.getPath();

    // Make sure path conforms to specification
    AppDevUtilities.tryCheckAppDevURL(path);

    // Attach content to router
    switch (this.requestType) {
    case 'GET':
      this.router.get(path, this.response());
      break;
    case 'POST':
      this.router.post(path, this.response());
      break;
    case 'DELETE':
      this.router.delete(path, this.response());
      break;
    default:
      throw new Error("HTTP method not specified!");
    }
  }

  /**
   * Create a wrapper around the response hook to pass to the Express
   * Router. 
   */
  response() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const content = await this.content(req);
        res.json(new AppDevResponse(true, content));
      } catch (e) {
        if (e.message === 1) {
          throw new Error('You must implement content()!');
        } else {
          res.json(new AppDevResponse(false, {errors: [e.message]}));
        }
      }
    }
  } 

  /**
   * Subclasses must override this response hook to generate response data
   * for the given request.
   */
  async content (req: Request): Promise<any> {
    throw new Error(1);
  }
}

export default AppDevRouter;
