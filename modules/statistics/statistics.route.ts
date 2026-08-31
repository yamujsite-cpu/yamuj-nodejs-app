import { Router } from "express";
import { protectRoutes } from "../users/user.service.js";
import { getStatistics } from "./statistics.service.js";

const router = Router();

router.get("/", protectRoutes, getStatistics);

export default router;
