import { type APIInteraction, InteractionType } from "discord-api-types/v10";
import { Hono } from "hono";
import type { PrismaClient } from "@prisma/client";
import { verifyDiscordRequestMiddleware } from "./middleware/discord";
import { prismaMiddleware } from "./middleware/prisma";
import {
  createMessageResponse,
  createPingPongResponse,
  InteractionData,
} from "./utils/interaction";
import { formatDate, truncate } from "./utils/formatter";
import {
  getParentCategoryBySubcategoryId,
  getSubcategoryById,
} from "./utils/category";
import categories from "./config/categories";
import { handleApplicationCommand } from "./application-command";

type Env = {
  Bindings: {
    DB: D1Database;
    DISCORD_TOKEN: string;
    DISCORD_APPLICATION_ID: string;
    DISCORD_PUBLIC_KEY: string;
  };
  Variables: {
    prisma: PrismaClient;
  };
};

const app = new Hono<Env>();

app.use(verifyDiscordRequestMiddleware);
app.use(prismaMiddleware);

app.post("/", async (c) => {
  const interaction: APIInteraction = await c.req.json();

  if (interaction.type === InteractionType.Ping) {
    const res = createPingPongResponse();
    return c.json(res);
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    try {
      const data = new InteractionData(interaction.data);
      const res = await handleApplicationCommand(data, c.var.prisma);
      return c.json(res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = createMessageResponse(error.message);
        return c.json(message);
      }
    }
  }

  return c.text("Bad request, 400");
});

export default app;
