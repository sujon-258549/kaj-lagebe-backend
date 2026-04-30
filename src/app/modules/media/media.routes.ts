import { Router } from "express";
import { MediaControllers } from "./media.controller.js";
import auth from "../../utils/auth.ts";

const router = Router();

router.post("/create-folder", auth(), MediaControllers.createFolder);
router.get("/folders", MediaControllers.getAllFolders);
router.get("/folder/:id", MediaControllers.getFolderById);
router.patch("/folder/:id", auth(), MediaControllers.updateFolder);
router.delete("/folder/:id", auth(), MediaControllers.deleteFolder);

router.post("/upload-image", auth(), MediaControllers.createImage);
router.get("/images", MediaControllers.getImages);
router.patch("/image/:id", auth(), MediaControllers.updateImage);
router.delete("/image/:id", auth(), MediaControllers.deleteImage);


export const MediaRoutes = router;
