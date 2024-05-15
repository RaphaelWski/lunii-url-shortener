import { Request, Response } from "express";
import validator from "validator";
import prisma from "../prisma/client";
import { log } from "@repo/logger";
import {
  ICreateShortUrlBody,
  ICreateShortUrlResponse,
  CustomError,
  ShortUrlAnalyticsResponse,
} from "../types/types";

interface ICreateShortUrlRequest extends Request {
  body: ICreateShortUrlBody;
}

const validateUrl = (url: string): boolean => {
  if (!url) {
    throw new CustomError({ error: "Missing 'url' object in request body" });
  }

  if (!validator.isURL(url)) {
    throw new CustomError({ error: "invalid URL" });
  }

  return true;
};

const createShortUrlInDatabase = async (url: string): Promise<string> => {
  const { shortUrl } = await prisma.shortUrlEntity.create({
    data: {
      originalUrl: url,
    },
  });

  return shortUrl;
};

export const createShortUrl = async (
  req: ICreateShortUrlRequest,
  res: Response
): Promise<Response<ICreateShortUrlResponse | CustomError>> => {
  try {
    const { url } = req.body;
    log(`url = ${url}`);

    validateUrl(url);

    const shortUrl = await createShortUrlInDatabase(url);
    log(`shortUrl: ${shortUrl}`);

    const urlShorten: ICreateShortUrlResponse = {
      originalUrl: url,
      shortUrl: shortUrl,
    };

    return res.json(urlShorten);
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(400).json(error);
    }

    log(error);
    return res
      .status(500)
      .json(new CustomError({ error: "Internal server error" }));
  }
};

export const handleShortUrl = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    log(`id = ${id}`);

    const shortUrl = await prisma.shortUrlEntity.findUnique({
      where: {
        shortUrl: id,
      },
    });

    if (!shortUrl) {
      throw new CustomError({ error: "Short URL not found" });
    }

    await prisma.shortUrlEntity.update({
      where: {
        shortUrl: id,
      },
      data: {
        nbClicks: shortUrl.nbClicks + 1,
      },
    });

    // Définir les en-têtes pour désactiver la mise en cache
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.redirect(301, shortUrl.originalUrl);
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(400).json(error);
    }

    log(error);
    return res
      .status(500)
      .json(new CustomError({ error: "Internal server error" }));
  }
};

export const handleShortUrlAnalytics = async (
  req: Request,
  res: Response
): Promise<Response<Array<ShortUrlAnalyticsResponse>> | void> => {
  try {
    const shortUrls = await prisma.shortUrlEntity.findMany();

    log(`shortUrls = ${JSON.stringify(shortUrls)}`);
    return res.json(
      shortUrls.map((shortUrl) => ({
        originalUrl: shortUrl.originalUrl,
        shortUrl: shortUrl.shortUrl,
        nbClicks: shortUrl.nbClicks,
      }))
    );
  } catch (error) {
    log(error);
    return res
      .status(500)
      .json(new CustomError({ error: "Internal server error" }));
  }
};
