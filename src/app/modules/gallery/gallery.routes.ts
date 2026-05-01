import express from "express";
import { GalleryControllers } from "./gallery.controller.ts";
import auth from "../../utils/auth.ts";

const router = express.Router();

router.post("/", auth(), GalleryControllers.createGallery);
router.get("/", GalleryControllers.getAllGalleries);
router.get("/:id", GalleryControllers.getSingleGallery);
router.patch("/:id", auth(), GalleryControllers.updateGallery);
router.delete("/:id", auth(), GalleryControllers.deleteGallery);
router.patch("/status/:id", auth(), GalleryControllers.updateStatus);

export const GalleryRoutes = router;
