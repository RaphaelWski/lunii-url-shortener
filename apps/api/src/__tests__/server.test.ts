import supertest from "supertest";
import { createServer } from "../server";

import { prismaMock } from "../prisma/singleton";

describe("server", () => {
  beforeEach(async () => {
    await prismaMock.$connect();
  });

  afterEach(async () => {
    await prismaMock.$disconnect();
  });

  it("status check returns 200", async () => {
    await supertest(createServer())
      .get("/api/status")
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });

  it("message endpoint says hello", async () => {
    await supertest(createServer())
      .get(`/api/message/jared`)
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe("hello jared");
      });
  });

  beforeEach(async () => {
    prismaMock.shortUrlEntity.create.mockResolvedValue({
      id: 1,
      originalUrl: "https://www.google.com",
      shortUrl: "https://short.url/abc123",
      createdAt: new Date(),
      updatedAt: new Date(),
      nbClicks: 0,
    });
  });
  it("shorturl endpoint returns a short url", async () => {
    await supertest(createServer())
      .post(`/api/shorturl`)
      .send({ url: "https://www.google.com" })
      .expect(200)
      .then((res) => {
        expect(res.body.originalUrl).toBe("https://www.google.com");
        expect(res.body.shortUrl).toBeDefined();
      });
  });

  it("shorturl endpoint returns an error for invalid url", async () => {
    await supertest(createServer())
      .post(`/api/shorturl`)
      .send({ url: "invalid-url" })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("invalid URL");
      });
  });
});
