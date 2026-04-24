import { Router } from "express";
import { UserController } from "./user.controller.js";
import auth from "../../utils/auth.ts";
import {  USER_ROLE } from "./user.constant.ts";

const router = Router();

router.post("/create-employ", UserController.createUser);

router.get("/", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.getAllUsers);
router.get("/my-data", auth(), UserController.getMyData);
router.get("/:id", UserController.getUserById);
router.patch("/change-password", auth(), UserController.changePassword);
router.post("/varify-otp", UserController.varifyOtp);
router.patch("/:id", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.updateUser);
router.delete("/:id", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.deleteUser);
router.patch("/:id/soft-delete", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.softDeleteUser);
router.patch("/:id/block", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.blockUser);
export const UserRouter = router;
