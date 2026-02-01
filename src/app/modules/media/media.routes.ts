import { Router } from "express";
import { MediaControllers } from "./media.controller.js";

const router = Router();

router.post("/create-folder", MediaControllers.createFolder);
router.get("/folders", MediaControllers.getAllFolders);
router.get("/folder/:id", MediaControllers.getFolderById);
router.patch("/folder/:id", MediaControllers.updateFolder);
router.delete("/folder/:id", MediaControllers.deleteFolder);

router.post("/upload-image", MediaControllers.createImage);
router.get("/images", MediaControllers.getImages);

export const MediaRoutes = router;
