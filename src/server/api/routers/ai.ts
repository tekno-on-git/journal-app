import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export const AIRouter = createTRPCRouter({
  rateEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.entry.findFirst({
        where: {
          id: input.id,
        },
        select: {
          content: true,
        },
      });

      const prompt =
        "Do sentiment analysis on the following statement between 1 and 10, 1 being negative and 10 being positive, return only the number so now extra text: ";
      const aiResponse = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt + entry?.content,
      });
      console.log(aiResponse);

      let rating = aiResponse.choices[0]?.text;
      rating = rating!.replace(/(\r\n|\n|\r)/gm, "");

      await ctx.db.entry.update({
        where: {
          id: input.id,
        },
        data: {
          moodRating: parseInt(rating),
        },
      });
    }),
});
