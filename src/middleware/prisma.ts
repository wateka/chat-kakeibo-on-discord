import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { createMiddleware } from "hono/factory";

type Env = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    prisma: PrismaClient;
  };
};

export const prismaMiddleware = createMiddleware<Env>(async (c, next) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  c.set("prisma", prisma);
  return await next();
});
