import net from "net";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { check, waitUntilUsed, waitUntilFree } from "./index";

let server: net.Server;
const TEST_PORT = 48567;

beforeAll(() => {
  return new Promise<void>((resolve) => {
    server = net.createServer();
    server.listen(TEST_PORT, "127.0.0.1", () => resolve());
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe("check", () => {
  it("should return true for a port in use", async () => {
    const result = await check({ port: TEST_PORT });
    expect(result).toBe(true);
  });

  it("should return false for a port not in use", async () => {
    const result = await check({ port: 48568 });
    expect(result).toBe(false);
  });

  it("should accept a custom host", async () => {
    const result = await check({ port: TEST_PORT, host: "127.0.0.1" });
    expect(result).toBe(true);
  });

  it("should return false when connection times out", async () => {
    const result = await check({ port: 48569, timeout: 100 });
    expect(result).toBe(false);
  });
});

describe("waitUntilUsed", () => {
  it("should resolve immediately if port is already in use", async () => {
    await expect(
      waitUntilUsed({ port: TEST_PORT, maxWait: 1000 })
    ).resolves.toBeUndefined();
  });

  it("should reject if port does not become used within maxWait", async () => {
    await expect(
      waitUntilUsed({ port: 48570, maxWait: 500, retryInterval: 100 })
    ).rejects.toThrow("was not used within");
  });
});

describe("waitUntilFree", () => {
  it("should resolve immediately if port is already free", async () => {
    await expect(
      waitUntilFree({ port: 48571, maxWait: 1000 })
    ).resolves.toBeUndefined();
  });

  it("should reject if port does not become free within maxWait", async () => {
    await expect(
      waitUntilFree({ port: TEST_PORT, maxWait: 500, retryInterval: 100 })
    ).rejects.toThrow("was not free within");
  });

  it("should resolve when a port becomes free", async () => {
    const tempServer = net.createServer();
    const tempPort = 48572;

    await new Promise<void>((resolve) => {
      tempServer.listen(tempPort, "127.0.0.1", () => resolve());
    });

    setTimeout(() => tempServer.close(), 200);

    await expect(
      waitUntilFree({ port: tempPort, maxWait: 5000, retryInterval: 100 })
    ).resolves.toBeUndefined();
  });
});

describe("waitUntilUsed with delayed start", () => {
  it("should resolve when a port becomes used", async () => {
    const tempPort = 48573;
    let tempServer: net.Server;

    setTimeout(() => {
      tempServer = net.createServer();
      tempServer.listen(tempPort, "127.0.0.1");
    }, 200);

    await expect(
      waitUntilUsed({ port: tempPort, maxWait: 5000, retryInterval: 100 })
    ).resolves.toBeUndefined();

    await new Promise<void>((resolve) => tempServer!.close(() => resolve()));
  });
});
