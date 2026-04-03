import net from "net";

export interface CheckOptions {
  port: number;
  host?: string;
  timeout?: number;
}

export interface WaitOptions extends CheckOptions {
  retryInterval?: number;
  maxWait?: number;
}

export function check(options: CheckOptions): Promise<boolean> {
  const { port, host = "127.0.0.1", timeout = 2000 } = options;

  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export function waitUntilUsed(options: WaitOptions): Promise<void> {
  const { retryInterval = 250, maxWait = 10000, ...checkOpts } = options;

  return new Promise((resolve, reject) => {
    const start = Date.now();

    const poll = async () => {
      const inUse = await check(checkOpts);
      if (inUse) return resolve();

      if (Date.now() - start >= maxWait) {
        return reject(new Error(`Port ${checkOpts.port} was not used within ${maxWait}ms`));
      }

      setTimeout(poll, retryInterval);
    };

    poll();
  });
}

export function waitUntilFree(options: WaitOptions): Promise<void> {
  const { retryInterval = 250, maxWait = 10000, ...checkOpts } = options;

  return new Promise((resolve, reject) => {
    const start = Date.now();

    const poll = async () => {
      const inUse = await check(checkOpts);
      if (!inUse) return resolve();

      if (Date.now() - start >= maxWait) {
        return reject(new Error(`Port ${checkOpts.port} was not free within ${maxWait}ms`));
      }

      setTimeout(poll, retryInterval);
    };

    poll();
  });
}

export default check;
