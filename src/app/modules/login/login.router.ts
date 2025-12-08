import { Router } from "express";
import { AuthController } from "./login.controller.js";

const router = Router();

router.post("/login", AuthController.loginUser);

export const authRouter = router;
