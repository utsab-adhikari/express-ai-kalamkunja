import cron from "node-cron";
import {
  annapurna,
  ekantipur,
  pu,
  thektmpost,
  wion,
} from "../lib/scrabapis.js";
import connectDB from "../db/ConnectDB.js";
import News from "../models/newsModel.js";

cron.schedule("*/15 * * * *", async () => {
  console.log("Running scraper job:", new Date().toISOString());
  await connectDB();

  try {
    const [ekantipurNews, thektmpostNews, wionNews, annapurnaNews, puNews] =
      await Promise.all([ekantipur(), thektmpost(), wion(), annapurna(), pu()]);

    const allNews = [
      ...ekantipurNews,
      ...thektmpostNews,
      ...wionNews,
      ...annapurnaNews,
      ...puNews,
    ];

    if (allNews.length > 0) {
      const bulkOps = allNews.map((item) => ({
        updateOne: {
          filter: { link: item.link },
          update: { $setOnInsert: item },
          upsert: true,
        },
      }));

      const result = await News.bulkWrite(bulkOps);
      console.log(
        `Bulk write complete. Matched: ${result.matchedCount}, Inserted: ${result.upsertedCount}`
      );
    } else {
      console.log("No news fetched this cycle.");
    }
  } catch (err) {
    console.error("Scraper error:", err);
  }
});
