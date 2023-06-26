import { Plugin, ResolvedConfig } from "vite";
import * as http from "http";
import jsonServer, { MiddlewaresOptions } from "json-server";
import { join } from "path";
import fs from "fs";
import { NextFunction, IncomingMessage } from "connect";
//@ts-ignore
import is from "json-server/lib/cli/utils/is";
//@ts-ignore
import load from "json-server/lib/cli/utils/load";
//@ts-ignore
import pause from "connect-pause";

type PluginOptions = {
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
};

type HttpHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction
) => void;

const assertPluginOptions = (
  pluginOptions: Partial<PluginOptions>
): PluginOptions => {
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
  };
};

export const pluginJsonServer = (
  userOptions: Partial<PluginOptions> = {}
): Plugin => {
  const opts = assertPluginOptions(userOptions);

  const createServer = async (
    config: ResolvedConfig
  ): Promise<HttpHandler | undefined> => {
    const { root, logger } = config;
    try {
      const routeOpts: any = {
        id: opts.id,
        foreignKeySuffix: opts.foreignKeySuffix,
      };
      const defaultsOpts: MiddlewaresOptions = {
        static: join(root, opts.static),
        logger: !opts.quiet,
        readOnly: opts.readOnly,
        noCors: opts.noCors,
        noGzip: opts.noGzip,
        bodyParser: opts.bodyParser,
      };
      logger.info("  Loading: " + opts.source);
      const db = await load(opts.source);
      const app = jsonServer.create();
      const router = jsonServer.router(db, routeOpts);
      //@ts-ignore
      //router.db._.id = id;
      const defaults = jsonServer.defaults(defaultsOpts);
      app.use(defaults);
      // if (opts.routes) {
      //   const file = join(root, profile, routes);
      //   logger.info("  Routes: " + file);
      //   const refRoutes = JSON.parse(fs.readFileSync(file));
      //   const rewriter = jsonServer.rewriter(refRoutes);
      //   app.use(rewriter);
      // }
      // if (opts.middlewares) {
      //   const refMiddlewares = middlewares.map(function (m) {
      //     const file = join(root, profile, m);
      //     logger.info("  Middleware: " + file);
      //     return require(file);
      //   });
      //   logger.info("  Loading" + refMiddlewares);
      //   app.use(refMiddlewares);
      // }
      if (opts.delay) {
        logger.info("  Delay: " + opts.delay);
        app.use(pause(opts.delay));
      }
      app.use(router);
      return app;
    } catch (error) {
      console.log("createServer Error:", error);
      return undefined;
    }
  };

  return {
    name: "vite-plugin-json-server",
    configureServer: async (devServer) => {
      const { config, watcher } = devServer;
      const dir = join(config.root, opts.profile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let app = await createServer(config);
      if (!opts.unwatch) {
        const files = [opts.source];
        watcher.on("change", async (file) => {
          const reload = files.find((it) => file.endsWith(it));
          if (reload) {
            console.error(`Change file '${file}'`);
            app = await createServer(config);
          }
        });
      }
      devServer.middlewares.use(
        opts.apiPath,
        (req: IncomingMessage, res, next) => {
          app && app(req, res, next);
        }
      );
    },
  };
};
export default pluginJsonServer;
