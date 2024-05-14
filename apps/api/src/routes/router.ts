import { Router } from "express";
import { handleNameMessage } from "./message";
import { handleStatus } from "./status";

const router: Router = Router();

router.get("/message/:name", handleNameMessage);
router.get("/status", handleStatus);

export default router;
