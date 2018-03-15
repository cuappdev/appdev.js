// @flow

import express, {Application, Router, Request, Response, NextFunction} from 'express';

/**
 * ExpressHandlerFunction - the function signature of callbacks for Express
 * Router objects
 */
export type ExpressHandlerFunction = (Request, Response, NextFunction) => any;

/**
 * AppDevAPI - create an Express Application object from a series of middleware
 * and routers
 *
 * Use this as a way to cleanly and quickly create an Expression Application.
 */
class AppDevAPI {
  express: Application;
  rootPath: string;
  middleware: Array<ExpressHandlerFunction>;
  routers: Array<Router>;

  /**
   * When constructing AppDevAPI objects, a client must provide the root path,
   * the middleware, and the routers for the Express Application.
   */
  constructor(
    rootPath: string, 
    middleware: Array<ExpressHandlerFunction>, 
    routers: Array<Router>) {

    this.express = express();
    this.rootPath = rootPath;
    this.middleware = middleware;
    this.middleware = routers;
  }

  /**
   * Initialize the Express Application object using the provided 
   * parameters. 
   */
  init() {
    AppDevUtilities.tryCheckAppDevURL(this.rootPath);

    for (let i = 0; i < this.middleware.length; i++) {
      this.app.use(this.middleware[i]);
    }

    for (let i = 0; i < this.routers.length; i++) {
      this.app.use(this.rootPath, this.routers[i]);
    }
  }
}