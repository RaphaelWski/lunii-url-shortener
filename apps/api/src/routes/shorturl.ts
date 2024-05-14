import { Request, Response } from "express";
import validator from "validator";
import prisma from "../prisma/client";
import { log } from "@repo/logger";
import { ICreateShortUrlBody, ICreateShortUrlResponse, CustomError } from "../types/types";

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
    return res.status(500).json(new CustomError({ error: "Internal server error" }));
  }
};