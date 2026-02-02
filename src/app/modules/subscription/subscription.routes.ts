import express from "express";


import { SubscriptionControllers } from "./subscription.controller.ts";

const router = express.Router();

router.post("/", SubscriptionControllers.createSubscription);
router.get("/", SubscriptionControllers.getAllSubscription);
router.get("/:id", SubscriptionControllers.getSubscriptionById);
router.put("/:id", SubscriptionControllers.updateSubscription);
router.delete("/:id", SubscriptionControllers.deleteSubscription);

export const SubscriptionRoutes = router;
