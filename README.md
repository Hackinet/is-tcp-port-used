# is-tcp-port-used

[![npm version](https://img.shields.io/npm/v/is-tcp-port-used.svg)](https://www.npmjs.com/package/is-tcp-port-used)
[![npm downloads](https://img.shields.io/npm/dm/is-tcp-port-used.svg)](https://www.npmjs.com/package/is-tcp-port-used)
[![bundle size](https://img.shields.io/bundlephobia/minzip/is-tcp-port-used)](https://bundlephobia.com/package/is-tcp-port-used)
[![license](https://img.shields.io/npm/l/is-tcp-port-used.svg)](https://github.com/Hackinet/is-tcp-port-used/blob/master/LICENSE)

> Check if a TCP port is in use, wait until free or used

A modern, zero-dependency replacement for [`tcp-port-used`](https://www.npmjs.com/package/tcp-port-used). Built with TypeScript, async/await, and a clean options-based API.

## Why?

`tcp-port-used` hasn't been updated since 2020, uses outdated patterns (`var`, callbacks, manual deferreds), drags in unnecessary dependencies, and has a broken bugs URL. This package does the same thing in ~70 lines with zero dependencies and full TypeScript support.

## Install

```sh
npm install is-tcp-port-used
```

## Usage

### Check if a port is in use

```ts
import { check } from "is-tcp-port-used";

const inUse = await check({ port: 3000 });
console.log(inUse); // true or false
```

### With custom host and timeout

```ts
const inUse = await check({
  port: 3000,
  host: "192.168.1.100",
  timeout: 5000,
});
```

### Wait until a port is used

Useful for waiting on a server to start:

```ts
import { waitUntilUsed } from "is-tcp-port-used";

await waitUntilUsed({
  port: 3000,
  retryInterval: 250, // check every 250ms (default)
  maxWait: 10000,      // give up after 10s (default)
});

console.log("Server is up!");
```

### Wait until a port is free

Useful for waiting on a server to shut down:

```ts
import { waitUntilFree } from "is-tcp-port-used";

await waitUntilFree({
  port: 3000,
  retryInterval: 250,
  maxWait: 10000,
});

console.log("Port is free!");
```

## API

### `check(options): Promise<boolean>`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | `number` | — | Port to check (required) |
| `host` | `string` | `"127.0.0.1"` | Host to connect to |
| `timeout` | `number` | `2000` | Connection timeout in ms |

### `waitUntilUsed(options): Promise<void>`
### `waitUntilFree(options): Promise<void>`

Same options as `check`, plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `retryInterval` | `number` | `250` | Time between checks in ms |
| `maxWait` | `number` | `10000` | Max wait time in ms before rejecting |

## CommonJS

```js
const { check, waitUntilUsed, waitUntilFree } = require("is-tcp-port-used");
```

## TypeScript

Types are included — no need to install `@types/is-tcp-port-used`.

## Migrating from tcp-port-used

```diff
- const tcpPortUsed = require("tcp-port-used");
- tcpPortUsed.check(3000, "127.0.0.1")
+ import { check } from "is-tcp-port-used";
+ check({ port: 3000, host: "127.0.0.1" })

- tcpPortUsed.waitUntilFree(3000, 500, 10000)
+ waitUntilFree({ port: 3000, retryInterval: 500, maxWait: 10000 })
```

No more guessing which positional argument is which.

## License

[MIT](LICENSE) - Piyush Jha
