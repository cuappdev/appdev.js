// @flow
import { Request } from 'express';
import AppDevRouter from './AppDevRouter';

type id = number

/**
 * Thin wrapper for fetching nodes. Mainly to ensure format for now.
 * NOTE: standarizes the use of ":id" as the main entity's id parameter.
 * (aka, the route needs an :id field)
 * type T: The type of nodes returned.
 */
class AppDevNodeRouter<T> extends AppDevRouter {
  /** ABSTRACT: the subclass returns an entity */
  async contentEntity (id: id): Promise<?T> {
    throw new Error(`Not implemented for path ${this.getPath()}`);
  }

  /** @return the rendered content */
  async content (req: Request) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error(`Invalid id ${req.params.id}`);

    const node: ?T = await this.contentEntity(id);
    if (!node) throw new Error(`Could not fetch id:${req.params.id}`);

    return { node };
  }
}

export default AppDevNodeRouter;
