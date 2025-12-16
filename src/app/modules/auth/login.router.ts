import { Router } from "express";
import { AuthController } from "./login.controller.js";

const router = Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.createRefreshToken);

export const authRouter = router;
