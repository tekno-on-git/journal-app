import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { journalRouter } from "@/server/api/routers/journal";
import { AIRouter } from "./routers/ai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  journal: journalRouter,
  ai: AIRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
