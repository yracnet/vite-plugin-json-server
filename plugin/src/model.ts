import * as http from "http";
import { NextFunction } from "connect";
import { join } from "path";
//@ts-ignore
import is from "json-server/lib/cli/utils/is.js";
import { QueryMode, QueryTransform, resolveQueryMode } from "./query";

// PluginOptions is what the user may pass to pluginJsonServer(). Some fields
// accept more than one shape (e.g. queryMode: "default" | "apiV1" | fn).
export type PluginOptions = {
  source: string;
  apiPath: string;
  profile: string;
  static: string;
  // routes: string;
  // snapshots: string;
  // middlewares: string[];
  unwatch: boolean;
  readOnly: boolean;
  bodyParser: boolean;
  noCors: boolean;
  noGzip: boolean;
  delay: number;
  id: string;
  foreignKeySuffix: string;
  quiet: boolean;
  queryMode: QueryMode;
};

// PluginConfig is what the rest of the plugin actually works with: every
// option has been resolved to the single concrete shape it needs, so no
// other module has to branch over what the user was allowed to pass.
export type PluginConfig = Omit<PluginOptions, "queryMode"> & {
  queryMode: QueryTransform;
};

export type HttpHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction
) => void;

export const ensureConfig = (
  pluginOptions: Partial<PluginOptions>
): PluginConfig => {
  const {
    apiPath = "/api",
    profile = "",
    source = "db.json",
    static: staticDir = "public",
    // routes = "routes.json",
    // snapshots = "snapshots",
    // middlewares = [],
    unwatch = false,
    readOnly = false,
    bodyParser = true,
    noCors = false,
    noGzip = false,
    delay = 10,
    id = "_id",
    foreignKeySuffix = "_id",
    quiet = false,
    queryMode = "default",
  } = pluginOptions;
  return {
    apiPath,
    profile,
    source: is.URL(source) ? source : join(profile, source),
    static: join(profile, staticDir),
    // routes: join(profile, staticDir),
    // snapshots: join(profile, snapshots),
    // middlewares: join(profile, middlewares),
    unwatch,
    readOnly,
    bodyParser,
    noCors,
    noGzip,
    delay,
    id,
    foreignKeySuffix,
    quiet,
    queryMode: resolveQueryMode(queryMode),
  };
};
