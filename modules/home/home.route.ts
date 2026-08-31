import { Router } from "express";
import { getHomeController } from "./home.service.js";

const router = Router();

router.get("/", getHomeController);

export default router;
