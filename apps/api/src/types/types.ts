export interface ICreateShortUrlBody {
  url: string;
}

export interface ICreateShortUrlResponse {
  originalUrl: string;
  shortUrl: string;
}

export class CustomError {
  error: string;

  constructor({ error }: { error: string }) {
    this.error = error;
  }
}

export interface ShortUrlAnalyticsResponse {
  originalUrl: string;
  shortUrl: string;
  nbClicks: number;
}
