import express from "express";


import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { SubscriptionControllers } from "./subscription.controller.ts";

const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SubscriptionControllers.createSubscription);
router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SubscriptionControllers.getAllSubscription);
router.get("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SubscriptionControllers.getSubscriptionById);
router.put("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SubscriptionControllers.updateSubscription);
router.delete("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SubscriptionControllers.deleteSubscription);

export const SubscriptionRoutes = router;
