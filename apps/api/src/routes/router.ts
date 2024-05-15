import { Router } from "express";
import { handleNameMessage } from "./message";
import { handleStatus } from "./status";
import { createShortUrl, handleShortUrl, handleShortUrlAnalytics } from "./shorturl";

const router: Router = Router();

router.get("/message/:name", handleNameMessage);
router.get("/status", handleStatus);
router.post("/shorturl", createShortUrl);
router.get("/shorturl/analytics", handleShortUrlAnalytics);
router.get("/shorturl/:id", handleShortUrl);

export default router;
