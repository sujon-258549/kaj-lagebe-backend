import express from "express";
import { SubscriptionControllers } from "./subscription.controller.ts";
import auth from "../../utils/auth.ts";

const router = express.Router();

router.post("/", auth(), SubscriptionControllers.createSubscription);
router.get("/", SubscriptionControllers.getAllSubscription);
router.get("/:id", SubscriptionControllers.getSubscriptionById);
router.put("/:id", auth(), SubscriptionControllers.updateSubscription);
router.patch("/:id/status", auth(), SubscriptionControllers.updateSubscriptionStatus);
router.delete("/:id", auth(), SubscriptionControllers.deleteSubscription);

export const SubscriptionRoutes = router;
