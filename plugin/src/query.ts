import * as http from "http";
import { NextFunction } from "connect";

// A QueryTransform receives the incoming request's query params and returns
// the query params json-server's router actually understands
// (_page, _limit, _sort, _order, <field>, <field>_like, ...).
export type QueryTransform = (query: URLSearchParams) => URLSearchParams;

// queryMode is what the user configures; ensureConfig (see model.ts) resolves
// it down to a single QueryTransform so the rest of the plugin only ever
// deals with one shape:
//   "default" - query params already follow the json-server convention
//   "apiV1"   - JSON-encoded `filter`, `pager` and `sort` params, e.g.
//               filter={"title":"vite"}  -> title=vite
//               pager=[1,10]             -> _page=1&_limit=10
//               sort=[["title","desc"]]  -> _sort=title&_order=desc
//   function  - full custom mapping, provided by the user
export type QueryMode = "default" | "apiV1" | QueryTransform;

const identity: QueryTransform = (query) => query;

const applyApiV1: QueryTransform = (query) => {
  const output = new URLSearchParams();

  const filter = query.get("filter");
  if (filter) {
    try {
      const attrs = JSON.parse(filter) as Record<string, string | number>;
      Object.entries(attrs).forEach(([attr, value]) => {
        output.set(attr, String(value));
      });
    } catch {
      // ignore malformed filter
    }
  }

  const pager = query.get("pager");
  if (pager) {
    try {
      const [page, perPage] = JSON.parse(pager) as [number, number];
      if (page !== undefined) output.set("_page", String(page));
      if (perPage !== undefined) output.set("_limit", String(perPage));
    } catch {
      // ignore malformed pager
    }
  }

  const sort = query.get("sort");
  if (sort) {
    try {
      const columns = JSON.parse(sort) as [string, "asc" | "desc"][];
      if (columns.length) {
        output.set("_sort", columns.map(([col]) => col).join(","));
        output.set("_order", columns.map(([, order]) => order).join(","));
      }
    } catch {
      // ignore malformed sort
    }
  }

  query.forEach((value, key) => {
    if (!["filter", "pager", "sort"].includes(key)) {
      output.set(key, value);
    }
  });

  return output;
};

// resolveQueryMode is the only place that knows about queryMode's cases.
export const resolveQueryMode = (mode: QueryMode): QueryTransform => {
  if (mode === "default") return identity;
  if (mode === "apiV1") return applyApiV1;
  return mode;
};

type QueryHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction
) => void;

// createQueryAdapter wraps a resolved QueryTransform as connect middleware,
// rewriting both req.url and req.query so json-server's router (which reads
// req.query) sees the translated params regardless of how it was cached.
export const createQueryAdapter = (transform: QueryTransform): QueryHandler => (
  req,
  _res,
  next
) => {
  const [path, search = ""] = (req.url ?? "").split("?");
  const output = transform(new URLSearchParams(search));
  const query = output.toString();
  req.url = query ? `${path}?${query}` : path;
  (req as any).query = Object.fromEntries(output.entries());
  next();
};
