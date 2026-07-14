**vite-plugin-json-server**
![vite-plugin-json-server](https://github.com/yracnet/vite-plugin-json-server)

## Description

vite-plugin-json-server is a plugin for Vite.js that integrates the json-server library, providing a simple way to serve a mock RESTful API during development. It enables you to quickly set up a server and define JSON data as endpoints, allowing you to simulate backend functionality without the need for a real server.
This plugin is designed to seamlessly integrate with Vite.js, leveraging its fast and efficient development server. By combining the power of Vite.js and json-server, you can streamline your frontend development process and focus on building your application.

## Motivation

During frontend development, it is often necessary to work with an API before the actual backend is ready or available. This can cause delays and hinder the development process. With vite-plugin-json-server, you can overcome this hurdle by creating a mock API server with minimal effort. It allows you to define your data, endpoints, and even custom routes, providing a flexible and efficient solution for frontend development.

## How to Use

1. Install the plugin using npm or yarn:

```bash
npm install vite-plugin-json-server --save-dev
```

or

```bash
yarn add vite-plugin-json-server --dev
```

2. Import and use the plugin in your `vite.config.js` file:

```javascript
import jsonServer from "vite-plugin-json-server";
export default {
  plugins: [
    jsonServer({
      // Configuration options
    }),
  ],
};
```

3. Start your Vite development server:

```bash
npm run dev
```

4. Your mock API server will be available at `http://localhost:5173` by default.

## Configuration

The plugin supports the following configuration options:

- `apiPath`: The base path for publishing json-server services. Default value: '/api'.
- `profile`: The profile name as directory name where other files are referenced. It can be used to customize data profile as needed. The default value is an empty string. You can use 'db-dev' or 'db1' as profile names.
- `source`: The resource to load and pass as main parameters to json-server. It is used with `join(profile, source)` when compiling.
- `static`: The name of the profile that contains static files. It is derived from `join(profile, source)`.
- `unwatch`: An inverse flag for the `watch` option that monitors and reloads the server when changes are detected.
- `readOnly`: A flag for json-server to enable read-only mode.
- `bodyParser`: A flag for json-server to enable body parsing.
- `noCors`: A flag for json-server to disable CORS (Cross-Origin Resource Sharing).
- `noGzip`: A flag for json-server to disable Gzip compression.
- `delay`: The delay value for json-server to simulate network latency.
- `id`: The value for json-server's `id` option.
- `foreignKeySuffix`: The value for json-server's `foreignKeySuffix` option.
- `quiet`: The value for json-server's `quiet` option.
  Please refer to the [json-server documentation](https://github.com/typicode/json-server) for more details on these configuration options.

**Note:** The following options are not yet supported by the plugin and will be implemented in a future version: `routes`, `snapshots`, and `middlewares`.

**Note:** The `host` and `port` options are excluded form the plugin.

## License

This plugin is licensed under the [MIT License](https://opensource.org/licenses/MIT).
