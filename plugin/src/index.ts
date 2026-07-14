import { Plugin, ResolvedConfig } from "vite";
import jsonServer, { MiddlewaresOptions } from "json-server";
import { join } from "path";
import fs from "fs";
import { IncomingMessage } from "connect";
//@ts-ignore
import load from "json-server/lib/cli/utils/load.js";
//@ts-ignore
import pause from "connect-pause";
import { PluginOptions, PluginConfig, HttpHandler, ensureConfig } from "./model";
import { createQueryAdapter } from "./query";

export const pluginJsonServer = (
  userOptions: Partial<PluginOptions> = {}
): Plugin => {
  const opts: PluginConfig = ensureConfig(userOptions);

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
      app.use(createQueryAdapter(opts.queryMode));
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
