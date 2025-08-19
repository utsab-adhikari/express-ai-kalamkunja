import axios from "axios";
import * as cheerio from "cheerio";

export async function ekantipur(req, res) {
  try {
    const response = await axios.get("https://ekantipur.com/news", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const newsList = [];

    $("article.normal").each((_, el) => {
      const headline = $(el).find("h2 a").text().trim();
      const anchor = $(el).find("h2 a").attr("href");
      const link = anchor ? `https://ekantipur.com${anchor}` : undefined;
      const slug = $(el).find("p").text().trim();
      const image =
        $(el).find(".image figure a img").attr("src") ||
        $(el).find(".image figure a img").attr("data-src");

      newsList.push({
        headline,
        slug,
        image,
        link,
        source: "ekantipur",
      });
    });

    return newsList;
  } catch (error) {
    return res.json({
      success: false,
      status: 500,
      message: ["Error while fetching news: ", error.message],
    });
  }
}

export async function thektmpost(req, res) {
  try {
    const response = await axios.get("https://kathmandupost.com/national", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const newsList = [];

    $("article").each((_, el) => {
      const headline = $(el).find("h3").text().trim();
      const slug = $(el).find("p").text().trim();
      const link = $(el).find("a").attr("href");
      const image =
        $(el).find("figure img").attr("data-src") ||
        $(el).find("figure img").attr("src");

      newsList.push({
        headline,
        slug,
        image,
        source: "kathmandupost",
        link: link?.startsWith("http")
          ? link
          : `https://kathmandupost.com${link}`,
      });
    });

    return newsList;
  } catch (error) {
    return res.json({
      success: false,
      status: 500,
      message: ["Error while fetching news: ", error.message],
    });
  }
}

export async function wion(req, res) {
  try {
    // Annapurna Post को राष्ट्रिय पृष्ठबाट HTML ल्याउने
    const response = await axios.get("https://www.wionews.com/latest-news", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const newsList = [];

    $(".ui-componets_card__A64eM").each((_, el) => {
      const headline = $(el)
        .find(".content .ui-componets_headingH3__beR_u a h3")
        .text()
        .trim();
      const slug = $(el).find(".content .summaryCardText p").text().trim();
      const link = $(el)
        .find(".content .ui-componets_headingH3__beR_u a")
        .attr("href");
      const image =
        $(el).find(".ui-componets_image__IsFnl a img").attr("data-src") ||
        $(el).find(".ui-componets_image__IsFnl a img").attr("src");

      newsList.push({
        headline,
        slug,
        image,
        source: "wionnews",
        link: link?.startsWith("http")
          ? link
          : `https://www.wionews.com/${link}`,
      });
    });

    return newsList;
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      status: 500,
      message: ["समाचार ल्याउँदा समस्या आयो:", error.message],
    });
  }
}

export async function annapurna(req, res) {
  try {
    // Annapurna Post को राष्ट्रिय पृष्ठबाट HTML ल्याउने
    const response = await axios.get(
      "https://annapurnapost.com/category/latest-news",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.google.com/",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          Connection: "keep-alive",
        },
      }
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const newsList = [];

    // प्रत्येक समाचार article को लागि headline, summary, image, र link निकाल्ने
    $(".grid__card").each((_, el) => {
      const headline = $(el).find(".card__title a").text().trim();
      const slug = $(el).find(".card__desc").text().trim(); // छोटकरीमा विवरण
      const link = $(el).find("a").attr("href");
      const image =
        $(el).find(".card__img img").attr("data-src") ||
        $(el).find(".card__img img").attr("src");

      newsList.push({
        headline,
        slug,
        image,
        source: "annapurnapost",
        link: link?.startsWith("http")
          ? link
          : `https://annapurnapost.com${link}`,
      });
    });

    return newsList;
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      status: 500,
      message: ["समाचार ल्याउँदा समस्या आयो:", error.message],
    });
  }
}

export async function pu(req, res) {
  try {
    const response = await axios.get("https://pu.edu.np/news", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const newsList = [];

    $(".news-card").each((_, el) => {
      const headline = $(el).find(".news-card-content p").text().trim();
      const slug =
        headline?.slice(0, 100).replace(/\s+/g, "-").toLowerCase() || null;
      let link = $(el).find("a").attr("href");
      if (link && !link.startsWith("http")) link = `https://pu.edu.np${link}`;

      // Image: <img> or background-image in inline style
      let image =
        $(el).find("figure img").attr("data-src") ||
        $(el).find("figure img").attr("src") ||
        null;

      // Fix for background-image in .news-card-img
      if (!image) {
        const style =
          $(el).find(".img-wrap .news-card-img").attr("style") || "";
        const bgMatch = style.match(
          /background-image:\s*url\(['"]?(.*?)['"]?\)/i
        );
        if (bgMatch && bgMatch[1]) image = bgMatch[1];
      }
      newsList.push({
        headline,
        slug,
        image:
          image || "https://pu.edu.np/wp-content/uploads/2024/08/dark_pu.svg",
        source: "pu",
        link,
      });
    });

    return newsList;
  } catch (error) {
    return res.json({
      success: false,
      status: 500,
      message: ["Error while fetching news: ", error.message],
    });
  }
}
