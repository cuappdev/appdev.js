// @flow
import { Request } from 'express';
import AppDevRouter from './AppDevRouter';

export type Cursor = number

export type AppDevEdge<T> = {
  cursor: Cursor,
  node: T,
}

export type PageInfo = {
  count: number,
  cursor?: Cursor
}

export type ResponseError = { message: string }

type ErrorCollector = Error => void

type AppDevEdgesResponse<T> = {
  edges: Array <AppDevEdge<T>>,
  errors ?: Array <ResponseError>,
}

/**
 * Represents an edge return in a REST API.
 * type T: The type of nodes returned.
 */
class AppDevEdgeRouter<T> extends AppDevRouter {
  /** Default number of edges to return */
  defaultCount () {
    return 10;
  }

  /** ABSTRACT: the subclass returns an array of edges */
  async contentArray (
    req: Request,
    pageInfo: PageInfo,
    error: ErrorCollector
  ): Promise<Array<AppDevEdge<T>>> {
    throw new Error(`Didn't implement contentArray for ${this.getPath()}`);
  }

  /** @return the rendered content */
  async content (req: Request) {
    const pageInfo = {
      count: req.query.count || this.defaultCount(),
      cursor: req.query.cursor || undefined
    };

    const errors = [];
    const onerror = err => { errors.push(err); };
    const edges = await this.contentArray(req, pageInfo, onerror);

    const response: AppDevEdgesResponse<T> = {
      edges,
      pageInfo: {
        count: edges.length
      }
    };

    if (errors.length) {
      response.errors = errors.map(err => ({
        message: err.message
      }));
    }

    return response;
  }
}

export default AppDevEdgeRouter;
