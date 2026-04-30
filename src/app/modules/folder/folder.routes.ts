import { Router } from "express";
import { FolderController } from "./folder.controller.ts";
import auth from "../../utils/auth.ts";

const router = Router();

router.post("/", auth(), FolderController.createFolder);
router.get("/", FolderController.getAllFolders);
router.get("/:id", FolderController.getFolderById);
router.put("/:id", auth(), FolderController.updateFolder);
router.delete("/:id", auth(), FolderController.deleteFolder);

export const FolderRoutes = router;
