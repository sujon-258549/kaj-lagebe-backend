import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

router.post("/create-employ", UserController.createUser);


export const  UserRouter = router