import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";

type Env = {
  Bindings: {
    DISCORD_PUBLIC_KEY: string;
  };
};

export const verifyDiscordRequestMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.text();

    const isValidRequest =
      signature &&
      timestamp &&
      (await verifyKey(body, signature, timestamp, c.env.DISCORD_PUBLIC_KEY));

    if (!isValidRequest) {
      return c.text("Bad request signature.", 401);
    }

    return await next();
  },
);
