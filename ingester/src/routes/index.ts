import { Router } from "express";
import { logController } from "../Controllers/log.controller";
import { queryController } from "../Controllers/query.controller";

const router = Router();

router.post("/", logController);
router.get("/", queryController);

export default router;
