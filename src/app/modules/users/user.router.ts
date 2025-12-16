import { Router } from "express";
import { UserController } from "./user.controller.js";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "./user.constant.ts";

const router = Router();

router.post("/create-employ", UserController.createUser);

router.get("/", UserController.getAllUsers);
router.get("/my-data", auth(USER_ROLE.USER,USER_ROLE.WORKER,USER_ROLE.EMPLOYEE), UserController.getMyData);
router.get("/:id", UserController.getUserById);
router.patch("/change-password", auth(USER_ROLE.USER,USER_ROLE.WORKER,USER_ROLE.EMPLOYEE), UserController.changePassword);
router.post("/varify-otp", UserController.varifyOtp);
router.patch("/:id", UserController.updateUser);
router.delete("/:id",  UserController.deleteUser);
export const UserRouter = router;
